# Kubernetes Hardening Verification Runbook

This runbook validates the Kubernetes architecture hardening controls that were added in `k8s/base` and the overlays.

Scope:
- Kubernetes manifests and runtime behavior only
- Minikube and generic cluster checks
- No cloud migration steps

## 1. Prerequisites

- `kubectl` points to the target cluster context
- Namespace deployed from one overlay:
  - `kubectl apply -k k8s/overlays/minikube`, or
  - `kubectl apply -k k8s/overlays/production`
- For NetworkPolicy enforcement on Minikube: use Calico CNI

Quick check:

```bash
kubectl config current-context
kubectl get ns rental
kubectl -n rental get deploy,svc,ingress,pdb,networkpolicy
```

## 2. Render And Schema Smoke

Goal: confirm both overlays render and include expected objects.

```bash
kubectl kustomize k8s/overlays/minikube >/tmp/minikube-kustomize.out
kubectl kustomize k8s/overlays/production >/tmp/production-kustomize.out

grep -n "kind: NetworkPolicy\|kind: PodDisruptionBudget\|name: rental-api-secrets" /tmp/minikube-kustomize.out
grep -n "kind: NetworkPolicy\|kind: PodDisruptionBudget\|name: rental-api-secrets" /tmp/production-kustomize.out
```

Expected:
- Render succeeds for both overlays
- Output includes network policies and PDBs
- Secret names contain a hash suffix (for example `rental-api-secrets-xxxxx`)

## 3. Workload Security Context Smoke

Goal: verify token mount hardening and read-only root filesystem are effective.

```bash
kubectl -n rental get deploy api-deployment -o jsonpath='{.spec.template.spec.serviceAccountName}{"\n"}'
kubectl -n rental get deploy client-deployment -o jsonpath='{.spec.template.spec.serviceAccountName}{"\n"}'

kubectl -n rental get deploy api-deployment -o jsonpath='{.spec.template.spec.automountServiceAccountToken}{"\n"}'
kubectl -n rental get deploy client-deployment -o jsonpath='{.spec.template.spec.automountServiceAccountToken}{"\n"}'

kubectl -n rental get deploy api-deployment -o jsonpath='{.spec.template.spec.containers[0].securityContext.readOnlyRootFilesystem}{"\n"}'
kubectl -n rental get deploy client-deployment -o jsonpath='{.spec.template.spec.containers[0].securityContext.readOnlyRootFilesystem}{"\n"}'
```

Expected:
- Service accounts are `rental-api` and `rental-client`
- `automountServiceAccountToken` is `false`
- `readOnlyRootFilesystem` is `true` for both workloads

## 4. NetworkPolicy Smoke Tests

Goal: verify only intended paths are allowed.

Start temporary curl pods:

```bash
kubectl -n rental run np-api-test --rm -it --restart=Never --image=curlimages/curl:8.7.1 -- sh
```

Inside the shell:

```bash
curl -sS -m 5 https://example.com >/dev/null && echo "api egress 443 allowed"
curl -sS -m 3 http://mongo-service.rental.svc.cluster.local:27017 || true
```

In a second terminal, run from a non-rental namespace:

```bash
kubectl create ns np-smoke --dry-run=client -o yaml | kubectl apply -f -
kubectl -n np-smoke run np-deny-test --rm -it --restart=Never --image=curlimages/curl:8.7.1 -- sh -c "curl -sS -m 3 http://api-service.rental.svc.cluster.local:80 || true"
```

Expected:
- DNS resolution works
- Access from unrelated namespace to rental services is denied
- API pod can reach approved external HTTPS endpoints

Notes:
- If every cross-pod request succeeds on Minikube, CNI is likely not enforcing NetworkPolicy.

## 5. Ingress Smoke

Goal: verify environment-specific ingress behavior.

Minikube overlay checks:

```bash
kubectl -n rental get ingress rental-ingress -o jsonpath='{.spec.rules[0].host}{"\n"}'
kubectl -n rental get ingress rental-ingress -o jsonpath='{.spec.tls}{"\n"}'
kubectl -n rental get ingress rental-ingress -o jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/ssl-redirect}{"\n"}'
```

Production overlay checks:

```bash
kubectl -n rental get ingress rental-ingress -o jsonpath='{.metadata.annotations.cert-manager\.io/cluster-issuer}{"\n"}'
kubectl -n rental get ingress rental-ingress -o jsonpath='{.metadata.annotations.nginx\.ingress\.kubernetes\.io/limit-rps}{"\n"}'
```

Expected:
- Minikube host is `rental.local`, no TLS, redirects disabled
- Production host uses TLS and cert-manager annotation

Notes:
- Some ingress controllers (including the default Minikube ingress addon) reject snippet annotations by policy.
- If you need response security headers, set them through ingress controller global config or at the application proxy layer.

## 6. PDB Smoke (Eviction Behavior)

Goal: verify disruption budgets restrict concurrent voluntary evictions.

```bash
kubectl -n rental get pdb
kubectl -n rental get pdb api-pdb -o jsonpath='{.status.disruptionsAllowed}{"\n"}'
kubectl -n rental get pdb client-pdb -o jsonpath='{.status.disruptionsAllowed}{"\n"}'
```

Optional explicit eviction test for API:

```bash
API_POD=$(kubectl -n rental get pod -l app=api -o jsonpath='{.items[0].metadata.name}')
cat <<EOF | kubectl create -f -
apiVersion: policy/v1
kind: Eviction
metadata:
  name: ${API_POD}
  namespace: rental
deleteOptions: {}
EOF
```

Expected:
- PDB objects exist and report allowed disruptions based on pod readiness
- Evictions that would exceed `maxUnavailable: 1` are denied

## 7. Secret Rotation Smoke

Goal: verify secret content changes trigger new generated names and deployment rollout.

```bash
kubectl -n rental get secret | grep rental-api-secrets
kubectl -n rental get deploy api-deployment -o jsonpath='{.spec.template.spec.containers[0].envFrom[1].secretRef.name}{"\n"}'
```

Rotate one value in overlay secret source file, then apply:

```bash
kubectl apply -k k8s/overlays/minikube
# or
kubectl apply -k k8s/overlays/production
```

Re-check:

```bash
kubectl -n rental get secret | grep rental-api-secrets
kubectl -n rental get deploy api-deployment -o jsonpath='{.spec.template.spec.containers[0].envFrom[1].secretRef.name}{"\n"}'
kubectl -n rental rollout status deploy/api-deployment
```

Expected:
- A new hashed `rental-api-secrets-*` name appears
- Deployment references the new hash name
- Rollout completes successfully

## 8. Quick Failure Triage

- Network policies appear ineffective:
  - confirm CNI supports enforcement
  - confirm policy objects exist in `rental`
- Ingress not reachable:
  - confirm ingress class controller is running
  - verify host mapping for `rental.local`
  - if webhook denies snippet annotations, remove snippet annotations or enable them at controller level
- PDB shows zero disruptions allowed:
  - verify replica count and pod readiness
- Secret rotation does not trigger rollout:
  - verify `disableNameSuffixHash` is not set in the overlay