output "api_target_group_arn" {
  description = "API target group ARN."
  value       = aws_lb_target_group.api.arn
}

output "api_target_group_arn_suffix" {
  description = "API target group ARN suffix for CloudWatch metrics."
  value       = aws_lb_target_group.api.arn_suffix
}

output "alb_dns_name" {
  description = "ALB DNS name."
  value       = aws_lb.api.dns_name
}

output "alb_arn_suffix" {
  description = "ALB ARN suffix for CloudWatch metrics."
  value       = aws_lb.api.arn_suffix
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name."
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID."
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront hosted zone ID for Route53 aliases."
  value       = aws_cloudfront_distribution.frontend.hosted_zone_id
}

output "frontend_bucket_name" {
  description = "S3 bucket name for frontend assets."
  value       = aws_s3_bucket.frontend.id
}

output "frontend_url" {
  description = "Frontend URL exposed to end users."
  value       = local.frontend_public_url
}

output "listener_arn" {
  description = "HTTP listener ARN for ALB."
  value       = aws_lb_listener.api_http.arn
}

output "kibana_target_group_arn" {
  description = "Kibana ALB target group ARN"
  value       = var.elk_enabled ? aws_lb_target_group.kibana[0].arn : null
}