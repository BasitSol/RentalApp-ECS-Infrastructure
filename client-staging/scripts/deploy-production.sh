#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

if [[ -z "${FRONTEND_BUCKET_NAME:-}" ]]; then
  echo "FRONTEND_BUCKET_NAME is required" >&2
  exit 1
fi

if [[ -z "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  echo "CLOUDFRONT_DISTRIBUTION_ID is required" >&2
  exit 1
fi

if [[ -z "${AWS_REGION:-}" ]]; then
  AWS_REGION="us-east-1"
fi

if [[ ! -d build ]]; then
  npm run build
fi

aws s3 sync build/ "s3://${FRONTEND_BUCKET_NAME}/" --delete --region "${AWS_REGION}"
aws cloudfront create-invalidation \
  --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths '/*' \
  --region "${AWS_REGION}" >/dev/null

echo "Frontend deployed to s3://${FRONTEND_BUCKET_NAME}/ and CloudFront invalidation requested."