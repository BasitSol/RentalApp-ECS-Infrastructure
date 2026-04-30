locals {
  name_prefix = "${var.project_name}-${var.environment}"

  mongodb_parameter_name = var.create_ssm_parameters ? aws_ssm_parameter.mongodb_uri[0].name : var.existing_ssm_mongodb_uri_name
  session_parameter_name = var.create_ssm_parameters ? aws_ssm_parameter.session_secret[0].name : var.existing_ssm_session_secret_name
  jwt_parameter_name     = var.create_ssm_parameters ? aws_ssm_parameter.jwt_secret[0].name : var.existing_ssm_jwt_secret_name

  ssm_parameter_arns = [
    for name in [local.mongodb_parameter_name, local.session_parameter_name, local.jwt_parameter_name] :
    "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${trimprefix(name, "/")}"
  ]

  effective_mongodb_uri = var.enable_internal_mongo ? "mongodb://${aws_instance.mongo[0].private_ip}:27017/rental_db" : var.mongodb_uri

  api_image = var.api_image_override != "" ? var.api_image_override : "${aws_ecr_repository.api.repository_url}:${var.api_image_tag}"

  log_group_name = "/ecs/${local.name_prefix}/api"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.tags
  )

  api_log_config = var.elk_enabled ? {
    logDriver = "awsfirelens"
    options = {
      Name        = "http"
      Match       = "*"
      Host        = var.logstash_endpoint
      Port        = "8080"
      URI         = "/"
      Format      = "json"
      tls         = "off"
      Retry_Limit = "2"
      Header      = "Content-Type application/json"
    }
    } : {
    logDriver = "awslogs"
    options = {
      awslogs-group         = aws_cloudwatch_log_group.api.name
      awslogs-region        = var.aws_region
      awslogs-stream-prefix = "ecs"
    }
  }
}