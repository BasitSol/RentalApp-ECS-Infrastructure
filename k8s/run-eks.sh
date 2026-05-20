#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLUSTER_NAME="${EKS_CLUSTER_NAME:-rentalapp-eks-prod-eks}"
REGION="${AWS_REGION:-us-east-1}"
NAMESPACE="rental"
OVERLAY_PATH="k8s/overlays/eks-production"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

info() {
  echo "[run-eks] $1"
}


require_cmd aws
require_cmd kubectl
require_cmd helm

cd "$ROOT_DIR"

info "Updating kubeconfig for cluster '$CLUSTER_NAME' in region '$REGION'"
aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION"

info "Installing ingress-nginx"
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx >/dev/null 2>&1 || true
helm repo update >/dev/null
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.replicaCount=2 \
  --set controller.service.type=LoadBalancer \
  --wait

info "Installing cert-manager"
helm repo add jetstack https://charts.jetstack.io >/dev/null 2>&1 || true
helm repo update >/dev/null
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true \
  --wait

info "Installing metrics-server"
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/ >/dev/null 2>&1 || true
helm repo update >/dev/null
helm upgrade --install metrics-server metrics-server/metrics-server \
  --namespace kube-system \
  --set args={--kubelet-insecure-tls} \
  --wait

info "Installing external-secrets"
helm repo add external-secrets https://charts.external-secrets.io >/dev/null 2>&1 || true
helm repo update >/dev/null
helm upgrade --install external-secrets external-secrets/external-secrets \
  --namespace external-secrets \
  --create-namespace \
  --set installCRDs=true \
  --wait

info "Applying production Kubernetes manifests"
kubectl apply -k "$OVERLAY_PATH"

info "Waiting for application rollout"
kubectl -n "$NAMESPACE" rollout status deploy/api-deployment --timeout=300s
kubectl -n "$NAMESPACE" rollout status deploy/client-deployment --timeout=300s

INGRESS_HOSTNAME="$(kubectl -n ingress-nginx get svc ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || true)"

echo
info "Ingress controller hostname: ${INGRESS_HOSTNAME:-pending}"
info "Application ingress: $(kubectl -n "$NAMESPACE" get ingress rental-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo pending)"
info "If you use a custom domain, point it at the ingress controller hostname once AWS assigns it."