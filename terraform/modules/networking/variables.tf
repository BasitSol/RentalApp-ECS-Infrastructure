variable "project_name" {
  description = "Project name used in naming and tagging."
  type        = string
}

variable "environment" {
  description = "Environment name used in naming and tagging."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
}

variable "public_subnet_cidrs" {
  description = "List of public subnet CIDR blocks."
  type        = list(string)

  validation {
    condition     = length(var.public_subnet_cidrs) >= 2
    error_message = "At least two public subnet CIDRs are required for high availability."
  }
}

variable "private_subnet_cidrs" {
  description = "List of private subnet CIDR blocks used by ECS tasks."
  type        = list(string)

  validation {
    condition     = length(var.private_subnet_cidrs) >= 2
    error_message = "At least two private subnet CIDRs are required for high availability."
  }
}

variable "availability_zones" {
  description = "Optional AZ list. If empty, module should auto-select available AZs."
  type        = list(string)
  default     = []
}

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames on the VPC."
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Enable DNS support on the VPC."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags to apply to all resources in this module."
  type        = map(string)
  default     = {}
}
