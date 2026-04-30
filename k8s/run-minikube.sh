#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROFILE="${MINIKUBE_PROFILE:-minikube}"
DRIVER="${MINIKUBE_DRIVER:-docker}"
CNI="${MINIKUBE_CNI:-calico}"
NAMESPACE="rental"
OVERLAY_PATH="k8s/overlays/minikube"
HOST_ENTRY_NAME="rental.local"

SKIP_BUILD=false
SKIP_HOSTS=false
SKIP_APPLY=false
SKIP_ADDONS=false

usage() {
  cat <<'EOF'
Usage: k8s/run-minikube.sh [options]

Starts Minikube, builds local images, applies the Minikube overlay,
waits for rollout, and configures rental.local host mapping.

Options:
  --skip-build      Skip Docker image build step
  --skip-hosts      Skip /etc/hosts update for rental.local
  --skip-apply      Skip kubectl apply step
  --skip-addons     Skip enabling ingress and metrics-server addons
  --profile NAME    Minikube profile (default: minikube)
  --help            Show this help

Environment overrides:
  MINIKUBE_PROFILE, MINIKUBE_DRIVER, MINIKUBE_CNI
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --skip-hosts)
      SKIP_HOSTS=true
      shift
      ;;
    --skip-apply)
      SKIP_APPLY=true
      shift
      ;;
    --skip-addons)
      SKIP_ADDONS=true
      shift
      ;;
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

info() {
  echo "[run-minikube] $1"
}

ensure_secret_file() {
  local file_path="$1"
  local example_path="$2"
  if [[ ! -f "$file_path" ]]; then
    cp "$example_path" "$file_path"
    info "Created $file_path from example."
  fi
}

update_hosts_entry() {
  local ip="$1"
  local hosts_line="$ip $HOST_ENTRY_NAME"

  if grep -Eq "^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+[[:space:]]+$HOST_ENTRY_NAME$" /etc/hosts; then
    if grep -Eq "^$ip[[:space:]]+$HOST_ENTRY_NAME$" /etc/hosts; then
      info "/etc/hosts already contains $hosts_line"
      return 0
    fi
  fi

  if [[ -w /etc/hosts ]]; then
    sed -i "/[[:space:]]$HOST_ENTRY_NAME$/d" /etc/hosts
    echo "$hosts_line" >> /etc/hosts
    info "Updated /etc/hosts with $hosts_line"
    return 0
  fi

  if command -v sudo >/dev/null 2>&1; then
    sudo sed -i "/[[:space:]]$HOST_ENTRY_NAME$/d" /etc/hosts
    echo "$hosts_line" | sudo tee -a /etc/hosts >/dev/null
    info "Updated /etc/hosts with $hosts_line"
    return 0
  fi

  echo "Could not update /etc/hosts automatically. Add this line manually:" >&2
  echo "$hosts_line" >&2
  return 1
}

require_cmd minikube
require_cmd kubectl
require_cmd docker
require_cmd curl

cd "$ROOT_DIR"

info "Starting Minikube profile '$PROFILE' (driver=$DRIVER, cni=$CNI)"
minikube start -p "$PROFILE" --driver="$DRIVER" --cni="$CNI"

if [[ "$SKIP_ADDONS" == false ]]; then
  info "Enabling Minikube addons: ingress, metrics-server"
  minikube -p "$PROFILE" addons enable ingress
  minikube -p "$PROFILE" addons enable metrics-server
fi

# shellcheck disable=SC2046
info "Switching Docker context to Minikube daemon"
eval "$(minikube -p "$PROFILE" docker-env)"

if [[ "$SKIP_BUILD" == false ]]; then
  info "Building backend image rental-backend:v1"
  docker build -t rental-backend:v1 ./api-staging

  info "Building frontend image rental-frontend:v1"
  docker build -t rental-frontend:v1 ./client-staging
fi

ensure_secret_file "k8s/overlays/minikube/secrets.env" "k8s/overlays/minikube/secrets.env.example"
ensure_secret_file "k8s/overlays/minikube/mongo-credentials.env" "k8s/overlays/minikube/mongo-credentials.env.example"

if [[ "$SKIP_APPLY" == false ]]; then
  info "Applying Kubernetes manifests from $OVERLAY_PATH"
  kubectl apply -k "$OVERLAY_PATH"

  info "Waiting for rollout in namespace $NAMESPACE"
  kubectl -n "$NAMESPACE" rollout status deploy/api-deployment --timeout=180s
  kubectl -n "$NAMESPACE" rollout status deploy/client-deployment --timeout=180s
  kubectl -n "$NAMESPACE" rollout status statefulset/mongo --timeout=180s
fi

MINI_IP="$(minikube -p "$PROFILE" ip)"

if [[ "$SKIP_HOSTS" == false ]]; then
  update_hosts_entry "$MINI_IP" || true
fi

info "Current workload summary"
kubectl -n "$NAMESPACE" get deploy,sts,svc,ingress,hpa,pdb,networkpolicy

info "Health check: http://$MINI_IP/api/healthz"
curl -sS -H "Host: $HOST_ENTRY_NAME" "http://$MINI_IP/api/healthz" || true

echo
info "Done. Open: http://$HOST_ENTRY_NAME"
info "Fallback if host mapping is unavailable: kubectl -n $NAMESPACE port-forward svc/client-service 8080:80"
