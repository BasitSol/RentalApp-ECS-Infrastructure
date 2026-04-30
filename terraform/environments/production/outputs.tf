output "vpc_id" {
  description = "VPC ID for production environment."
  value       = module.networking.vpc_id
}

output "nat_eip" {
  description = "Elastic IP for the NAT gateway. Whitelist this in MongoDB Atlas."
  value       = module.networking.nat_eip
}

output "public_subnet_ids" {
  description = "Public subnets used by runtime components."
  value       = module.networking.public_subnet_ids
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name."
  value       = module.load_balancing.alb_dns_name
}

output "api_ecr_repository_url" {
  description = "ECR repository URL for the API image."
  value       = module.compute.api_ecr_repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = module.compute.ecs_cluster_name
}

output "ecs_service_name" {
  description = "ECS service name for API."
  value       = module.compute.ecs_service_name
}

output "frontend_bucket_name" {
  description = "S3 bucket for frontend static assets."
  value       = module.load_balancing.frontend_bucket_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID."
  value       = module.load_balancing.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain."
  value       = module.load_balancing.cloudfront_domain_name
}

output "frontend_url" {
  description = "Frontend URL exposed to users."
  value       = module.load_balancing.frontend_url
}

output "api_base_url" {
  description = "API URL through CloudFront path routing."
  value       = "${module.load_balancing.frontend_url}/api"
}

output "ssm_parameter_names" {
  description = "SSM parameter names used by ECS task definition."
  value       = module.compute.ssm_parameter_names
}

output "kibana_url" {
  description = "Kibana dashboard URL via ALB"
  value       = var.elk_enabled ? "https://${module.load_balancing.cloudfront_domain_name}/kibana" : null
}

output "elasticsearch_internal_endpoint" {
  description = "Internal Elasticsearch endpoint"
  value       = var.elk_enabled ? module.elk[0].elasticsearch_endpoint : null
  sensitive   = true
}

output "api_target_group_arn" {
  description = "Full ARN of the API ALB target group"
  value       = module.load_balancing.api_target_group_arn
}