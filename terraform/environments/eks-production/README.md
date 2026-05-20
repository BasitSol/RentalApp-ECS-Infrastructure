# EKS Production Environment

This environment creates the AWS foundation for running the RentalApp workloads on EKS instead of ECS Fargate.

## What it creates

- A dedicated VPC with public and private subnets.
- An EKS control plane with managed node groups.
- Core EKS add-ons needed for basic cluster operation.
- An OIDC provider so IRSA-ready add-ons can be enabled later.

## How to use it

```bash
cd terraform/environments/eks-production
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

Terraform also installs the cluster add-ons (ingress-nginx, cert-manager, metrics-server, external-secrets) and applies the application manifests via the Kubernetes and Helm providers. This removes the need for the helper script.

## Notes

- Keep ECS production running until the EKS deployment is validated.
- Narrow `cluster_endpoint_public_access_cidrs` before moving the cluster into real production traffic.
- This environment uses a separate VPC CIDR from the current ECS production stack to avoid overlap during migration.