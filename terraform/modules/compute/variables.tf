variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "assign_public_ip" {
  type    = bool
  default = false
}

variable "service_security_group_id" {
  type = string
}

variable "target_group_arn" {
  type = string
}

variable "api_container_port" {
  type    = number
  default = 4000
}

variable "api_cpu" {
  type    = number
  default = 512
}

variable "api_memory" {
  type    = number
  default = 1024
}

variable "api_desired_count" {
  type    = number
  default = 1
}

variable "api_min_capacity" {
  type    = number
  default = 1
}

variable "api_max_capacity" {
  type    = number
  default = 2
}

variable "api_image_tag" {
  type    = string
  default = "latest"
}

variable "api_image_override" {
  type    = string
  default = ""
}

variable "api_log_retention_days" {
  type    = number
  default = 14
}

variable "frontend_public_url" {
  type = string
}

variable "create_ssm_parameters" {
  type    = bool
  default = true
}

variable "ssm_parameter_prefix" {
  type    = string
  default = "/rentalapp/prod"
}

variable "mongodb_uri" {
  type      = string
  default   = null
  sensitive = true
}

variable "session_secret" {
  type      = string
  default   = null
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  default   = null
  sensitive = true
}

variable "existing_ssm_mongodb_uri_name" {
  type    = string
  default = ""
}

variable "existing_ssm_session_secret_name" {
  type    = string
  default = ""
}

variable "existing_ssm_jwt_secret_name" {
  type    = string
  default = ""
}

variable "enable_internal_mongo" {
  type    = bool
  default = false
}

variable "mongo_instance_type" {
  type    = string
  default = "t3.micro"
}

variable "mongo_security_group_id" {
  type    = string
  default = null
}

variable "tags" {
  type    = map(string)
  default = {}
}
# Later Added for the Monitoring Part
variable "elk_enabled" {
  description = "Enable Fluent Bit sidecar to ship logs to ELK Logstash"
  type        = bool
  default     = false
}

variable "logstash_endpoint" {
  description = "Internal Logstash endpoint for Fluent Bit HTTP output"
  type        = string
  default     = ""
}
