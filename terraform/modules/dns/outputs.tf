output "fqdn" {
  description = "Final application FQDN."
  value       = var.enable_custom_domain ? aws_route53_record.frontend_alias[0].fqdn : null
}
