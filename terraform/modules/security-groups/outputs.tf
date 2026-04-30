output "alb_security_group_id" {
  description = "Security group ID attached to ALB."
  value       = aws_security_group.alb.id
}

output "ecs_service_security_group_id" {
  description = "Security group ID attached to ECS service tasks."
  value       = aws_security_group.ecs_service.id
}

output "mongo_security_group_id" {
  description = "Optional internal MongoDB security group ID."
  value       = var.enable_internal_mongo ? aws_security_group.mongo[0].id : null
}

output "elasticsearch_security_group_id" {
  description = "Elasticsearch security group ID"
  value       = var.elk_enabled ? aws_security_group.elasticsearch[0].id : null
}

output "logstash_security_group_id" {
  description = "Logstash security group ID"
  value       = var.elk_enabled ? aws_security_group.logstash[0].id : null
}

output "kibana_security_group_id" {
  description = "Kibana security group ID"
  value       = var.elk_enabled ? aws_security_group.kibana[0].id : null
}

output "elk_efs_security_group_id" {
  description = "ELK EFS security group ID"
  value       = var.elk_enabled ? aws_security_group.elk_efs[0].id : null
}