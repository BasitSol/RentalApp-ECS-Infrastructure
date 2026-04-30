output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name."
  value       = aws_ecs_service.api.name
}

output "api_ecr_repository_url" {
  description = "ECR repository URL for API container images."
  value       = aws_ecr_repository.api.repository_url
}

output "ecs_cluster_id" {
  description = "ECS cluster ID for attaching additional services"
  value       = aws_ecs_cluster.main.id
}

output "ssm_parameter_names" {
  description = "SSM parameter names used by ECS task definition."
  value = {
    mongodb_uri    = local.mongodb_parameter_name
    session_secret = local.session_parameter_name
    jwt_secret     = local.jwt_parameter_name
  }
}
