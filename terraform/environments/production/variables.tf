variable "aws_region" {
  description = "AWS region for core infrastructure."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used in resource naming."
  type        = string
  default     = "rentalapp"
}

variable "environment" {
  description = "Environment name used in resource naming."
  type        = string
  default     = "prod"
}

variable "tags" {
  description = "Additional tags to apply to all resources."
  type        = map(string)
  default     = {}
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs (at least two for HA)."
  type        = list(string)
  default     = ["10.20.1.0/24", "10.20.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs (at least two for HA)."
  type        = list(string)
  default     = ["10.20.101.0/24", "10.20.102.0/24"]
}

variable "availability_zones" {
  description = "Optional override for AZ list. Leave empty to auto-select."
  type        = list(string)
  default     = []
}

variable "frontend_bucket_name" {
  description = "Globally unique S3 bucket name for frontend assets."
  type        = string
}

variable "cloudfront_price_class" {
  description = "CloudFront price class for cost control."
  type        = string
  default     = "PriceClass_100"
}

variable "domain_name" {
  description = "Custom domain name for app (for example app.example.com)."
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID that contains domain_name."
  type        = string
  default     = ""
}

variable "enable_custom_domain" {
  description = "Enable custom domain + ACM + Route53 alias for CloudFront."
  type        = bool
  default     = false
}

variable "api_container_port" {
  description = "API container port."
  type        = number
  default     = 4000
}

variable "api_cpu" {
  description = "Fargate task CPU units for API task."
  type        = number
  default     = 512
}

variable "api_memory" {
  description = "Fargate task memory in MiB for API task."
  type        = number
  default     = 1024
}

variable "api_desired_count" {
  description = "Initial desired task count for API service."
  type        = number
  default     = 1
}

variable "api_min_capacity" {
  description = "Minimum autoscaling capacity for API service."
  type        = number
  default     = 1
}

variable "api_max_capacity" {
  description = "Maximum autoscaling capacity for API service."
  type        = number
  default     = 2
}

variable "api_image_tag" {
  description = "Tag used with created ECR repository URL."
  type        = string
  default     = "latest"
}

variable "api_image_override" {
  description = "Optional full image URI override. If empty, uses created ECR repository + api_image_tag."
  type        = string
  default     = ""
}

variable "api_health_check_path" {
  description = "ALB health check path for API target group."
  type        = string
  default     = "/readyz"
}

variable "enable_internal_mongo" {
  description = "Provision internal MongoDB on EC2 and use it for API connections."
  type        = bool
  default     = false
}

variable "mongo_instance_type" {
  description = "EC2 instance type for internal MongoDB host."
  type        = string
  default     = "t3.micro"
}

variable "api_log_retention_days" {
  description = "CloudWatch log retention for API container logs."
  type        = number
  default     = 14
}

variable "allow_api_public_ingress_cidrs" {
  description = "CIDRs allowed to call public ALB listener. Usually keep 0.0.0.0/0 and use CloudFront as entry."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "restrict_alb_to_cloudfront" {
  description = "If true, ALB only allows ingress from AWS CloudFront origin-facing managed prefix list."
  type        = bool
  default     = true
}

variable "create_ssm_parameters" {
  description = "Create SSM secure parameters from provided secret values."
  type        = bool
  default     = true
}

variable "ssm_parameter_prefix" {
  description = "SSM path prefix for application secrets."
  type        = string
  default     = "/rentalapp/prod"
}

variable "mongodb_uri" {
  description = "MongoDB URI used by API. Required when create_ssm_parameters=true."
  type        = string
  default     = null
  sensitive   = true
}

variable "session_secret" {
  description = "Session secret used by API. Required when create_ssm_parameters=true."
  type        = string
  default     = null
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret used by API. Required when create_ssm_parameters=true."
  type        = string
  default     = null
  sensitive   = true
}

variable "existing_ssm_mongodb_uri_name" {
  description = "Existing SSM parameter name for MongoDB URI when create_ssm_parameters=false."
  type        = string
  default     = ""
}

variable "existing_ssm_session_secret_name" {
  description = "Existing SSM parameter name for session secret when create_ssm_parameters=false."
  type        = string
  default     = ""
}

variable "existing_ssm_jwt_secret_name" {
  description = "Existing SSM parameter name for JWT secret when create_ssm_parameters=false."
  type        = string
  default     = ""
}

variable "enable_alerts" {
  description = "Enable basic CloudWatch alarms for API/ALB."
  type        = bool
  default     = true
}

variable "alert_email" {
  description = "Optional email subscriber for SNS alarm notifications."
  type        = string
  default     = ""
}

variable "monthly_budget_limit_usd" {
  description = "Monthly AWS budget cap (USD) for budget alert."
  type        = number
  default     = 150
}

variable "budget_alert_email" {
  description = "Optional email to receive AWS Budget notifications."
  type        = string
  default     = ""
}

variable "elk_enabled" {
  description = "Enable centralized logging with ELK stack on ECS Fargate"
  type        = bool
  default     = false
}

variable "elk_version" {
  description = "Elastic Stack version"
  type        = string
  default     = "7.17.18"
}

variable "elasticsearch_password" {
  description = "Bootstrap password for Elasticsearch elastic user"
  type        = string
  sensitive   = true
  default     = ""
}

variable "elasticsearch_cpu" {
  type    = number
  default = 2048
}

variable "elasticsearch_memory" {
  type    = number
  default = 4096
}

variable "logstash_cpu" {
  type    = number
  default = 1024
}

variable "logstash_memory" {
  type    = number
  default = 2048
}

variable "kibana_cpu" {
  type    = number
  default = 512
}

variable "kibana_memory" {
  type    = number
  default = 1024
}