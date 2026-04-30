locals {
  name_prefix = "${var.project_name}-${var.environment}"

  cloudfront_cache_optimized_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  cloudfront_cache_disabled_policy_id  = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  cloudfront_all_viewer_request_id     = "216adef6-5c7f-47e4-b989-5492eafa07d3"

  frontend_public_url = var.enable_custom_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.frontend.domain_name}"
}
