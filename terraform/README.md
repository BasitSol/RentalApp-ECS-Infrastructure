# Terraform Infrastructure

This directory uses an environment-wrapper and reusable-modules layout.

## Layout
- `modules/`: reusable building blocks
- `environments/`: environment-specific wrappers that call modules
- `policies/`: policy-as-code (optional)

## Usage
1. `cd environments/production`
2. `terraform init`
3. `terraform plan -out=tfplan`
4. `terraform apply tfplan`
