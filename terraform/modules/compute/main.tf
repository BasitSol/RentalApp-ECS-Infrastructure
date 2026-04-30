resource "aws_ecr_repository" "api" {
  name                 = "${local.name_prefix}-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire images beyond 20"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 20
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "api" {
  name              = local.log_group_name
  retention_in_days = var.api_log_retention_days
}

data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution" {
  name               = "${local.name_prefix}-ecs-exec-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_managed" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_policy" "ssm_read" {
  name = "${local.name_prefix}-ssm-read"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = local.ssm_parameter_arns
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_ssm" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = aws_iam_policy.ssm_read.arn
}

resource "aws_iam_role" "ecs_task" {
  name               = "${local.name_prefix}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_ssm_parameter" "mongodb_uri" {
  count = var.create_ssm_parameters ? 1 : 0

  name      = "${var.ssm_parameter_prefix}/mongodb_uri"
  type      = "SecureString"
  value     = local.effective_mongodb_uri
  overwrite = true
}

resource "aws_ssm_parameter" "session_secret" {
  count = var.create_ssm_parameters ? 1 : 0

  name      = "${var.ssm_parameter_prefix}/session_secret"
  type      = "SecureString"
  value     = var.session_secret
  overwrite = true
}

resource "aws_ssm_parameter" "jwt_secret" {
  count = var.create_ssm_parameters ? 1 : 0

  name      = "${var.ssm_parameter_prefix}/jwt_secret"
  type      = "SecureString"
  value     = var.jwt_secret
  overwrite = true
}

resource "aws_ecs_cluster" "main" {
  name = "${local.name_prefix}-cluster"
}

/*
resource "aws_ecs_task_definition" "api" {
	family                   = "${local.name_prefix}-api"
	network_mode             = "awsvpc"
	requires_compatibilities = ["FARGATE"]
	cpu                      = var.api_cpu
	memory                   = var.api_memory
	execution_role_arn       = aws_iam_role.ecs_task_execution.arn
	task_role_arn            = aws_iam_role.ecs_task.arn

	container_definitions = jsonencode([
		{
			name      = "api"
			image     = local.api_image
			essential = true
			portMappings = [
				{
					containerPort = var.api_container_port
					hostPort      = var.api_container_port
					protocol      = "tcp"
				}
			]
			environment = [
				{
					name  = "NODE_ENV"
					value = "production"
				},
				{
					name  = "PORT"
					value = tostring(var.api_container_port)
				},
				{
					name  = "SESSION_COOKIE_SECURE"
					value = "false"
				},
				{
					name  = "SESSION_COOKIE_SAME_SITE"
					value = "lax"
				},
				{
					name  = "CLIENT_URL"
					value = var.frontend_public_url
				}
			]
			secrets = [
				{
					name      = "MONGODB_URI"
					valueFrom = local.mongodb_parameter_name
				},
				{
					name      = "SESSION_SECRET"
					valueFrom = local.session_parameter_name
				},
				{
					name      = "JWT_SECRET"
					valueFrom = local.jwt_parameter_name
				}
			]
			#logConfiguration = {
				#logDriver = "awslogs"
				#options = {
					#awslogs-group         = aws_cloudwatch_log_group.api.name
					#awslogs-region        = var.aws_region
					#awslogs-stream-prefix = "ecs"
				#}
			#}
			logConfiguration = local.api_log_config

			// ADD THIS ENTIRE BLOCK (only when elk_enabled):
            var.elk_enabled ? {
                name  = "fluent-bit"
                image = "public.ecr.aws/aws-observability/aws-for-fluent-bit:stable"
                essential = false
                firelensConfiguration = {
                    type = "fluentbit"
                    options = {
                        "enable-ecs-log-metadata" = "true"
                }
            }
                logConfiguration = {
                    logDriver = "awslogs"
                    options = {
                        awslogs-group         = aws_cloudwatch_log_group.fluentbit[0].name
                        awslogs-region        = var.aws_region
                        awslogs-stream-prefix = "fluentbit"
                    }
                }
                memoryReservation = 128
            } : null
		}
	])
}
*/

# This is the updated aws-ecs-task_definition

resource "aws_ecs_task_definition" "api" {
  family                   = "${local.name_prefix}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.api_cpu
  memory                   = var.api_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode(concat(
    [
      {
        name      = "api"
        image     = local.api_image
        essential = true
        portMappings = [
          {
            containerPort = var.api_container_port
            hostPort      = var.api_container_port
            protocol      = "tcp"
          }
        ]
        environment = [
          {
            name  = "NODE_ENV"
            value = "production"
          },
          {
            name  = "PORT"
            value = tostring(var.api_container_port)
          },
          {
            name  = "SESSION_COOKIE_SECURE"
            value = "false"
          },
          {
            name  = "SESSION_COOKIE_SAME_SITE"
            value = "lax"
          },
          {
            name  = "CLIENT_URL"
            value = var.frontend_public_url
          }
        ]
        secrets = [
          {
            name      = "MONGODB_URI"
            valueFrom = local.mongodb_parameter_name
          },
          {
            name      = "SESSION_SECRET"
            valueFrom = local.session_parameter_name
          },
          {
            name      = "JWT_SECRET"
            valueFrom = local.jwt_parameter_name
          }
        ]
        logConfiguration = local.api_log_config
      }
    ],
    var.elk_enabled ? [
      {
        name      = "fluent-bit"
        image     = "public.ecr.aws/aws-observability/aws-for-fluent-bit:stable"
        essential = false
        firelensConfiguration = {
          type = "fluentbit"
          options = {
            "enable-ecs-log-metadata" = "true"
          }
        }
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.fluentbit[0].name
            awslogs-region        = var.aws_region
            awslogs-stream-prefix = "fluentbit"
          }
        }
        memoryReservation = 128
      }
    ] : []
  ))

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "fluentbit" {
  count             = var.elk_enabled ? 1 : 0
  name              = "/ecs/${local.name_prefix}-fluentbit"
  retention_in_days = 7
  tags              = local.common_tags
}


resource "aws_ecs_service" "api" {
  name            = "${local.name_prefix}-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.api_desired_count
  launch_type     = "FARGATE"

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.service_security_group_id]
    assign_public_ip = var.assign_public_ip
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "api"
    container_port   = var.api_container_port
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

resource "aws_appautoscaling_target" "api" {
  max_capacity       = var.api_max_capacity
  min_capacity       = var.api_min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "${local.name_prefix}-api-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = 65
    scale_in_cooldown  = 60
    scale_out_cooldown = 60

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}

resource "aws_appautoscaling_policy" "api_memory" {
  name               = "${local.name_prefix}-api-memory"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = 75
    scale_in_cooldown  = 60
    scale_out_cooldown = 60

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
  }
}

resource "aws_instance" "mongo" {
  count                       = var.enable_internal_mongo ? 1 : 0
  ami                         = data.aws_ami.amazon_linux_2023[0].id
  instance_type               = var.mongo_instance_type
  subnet_id                   = var.subnet_ids[0]
  vpc_security_group_ids      = compact([var.mongo_security_group_id])
  associate_public_ip_address = true

  user_data = <<-EOT
#!/bin/bash
set -euxo pipefail
dnf -y update
dnf -y install docker
systemctl enable --now docker
mkdir -p /opt/mongo-data
docker run -d --name mongo --restart unless-stopped -p 27017:27017 -v /opt/mongo-data:/data/db mongo:6.0 --bind_ip_all
EOT

  tags = {
    Name = "${local.name_prefix}-mongo-host"
  }
}
