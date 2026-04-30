data "aws_ec2_managed_prefix_list" "cloudfront_origin_facing" {
  count = var.restrict_alb_to_cloudfront ? 1 : 0
  name  = "com.amazonaws.global.cloudfront.origin-facing"
}
