output "vpc_id" {
  description = "ID of the VPC created by the networking module."
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the created VPC."
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of public subnets."
  value       = [for s in aws_subnet.public : s.id]
}

output "private_subnet_ids" {
  description = "IDs of private subnets used by ECS tasks."
  value       = [for s in aws_subnet.private : s.id]
}

output "public_subnet_cidrs" {
  description = "CIDR blocks of public subnets."
  value       = [for s in aws_subnet.public : s.cidr_block]
}

output "internet_gateway_id" {
  description = "Internet gateway ID attached to the VPC."
  value       = aws_internet_gateway.main.id
}

output "route_table_id" {
  description = "Route table ID used for public routing."
  value       = [for rt in aws_route_table.public : rt.id]
}

output "nat_eip" {
  description = "Elastic IP used by the NAT gateway for stable outbound Atlas allowlisting."
  value       = [for eip in aws_eip.nat : eip.public_ip]
}

output "availability_zones" {
  description = "Availability zones used by created subnets."
  value       = [for s in aws_subnet.public : s.availability_zone]
}
