output "elasticsearch_endpoint" {
  description = "Internal Elasticsearch CloudMap DNS endpoint"
  value       = "http://elasticsearch.${local.elk_namespace_name}:9200"
}

output "logstash_endpoint" {
  description = "Internal Logstash CloudMap DNS endpoint"
  value       = "logstash.${local.elk_namespace_name}"
}

output "kibana_endpoint" {
  description = "Internal Kibana CloudMap DNS endpoint"
  value       = "http://kibana.${local.elk_namespace_name}:5601"
}

output "elk_namespace_name" {
  description = "CloudMap namespace for ELK service discovery"
  value       = local.elk_namespace_name
}