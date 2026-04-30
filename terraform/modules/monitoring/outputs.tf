output "alerts_topic_arn" {
  description = "SNS topic ARN for alerts."
  value       = aws_sns_topic.alerts.arn
}

output "alarm_names" {
  description = "CloudWatch alarm names created by this module."
  value = {
    alb_target_5xx = var.enable_alerts ? aws_cloudwatch_metric_alarm.alb_target_5xx[0].alarm_name : null
    alb_latency    = var.enable_alerts ? aws_cloudwatch_metric_alarm.alb_latency[0].alarm_name : null
    ecs_cpu_high   = var.enable_alerts ? aws_cloudwatch_metric_alarm.ecs_cpu_high[0].alarm_name : null
  }
}
