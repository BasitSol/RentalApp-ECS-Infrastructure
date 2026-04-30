locals {
  name_prefix = "${var.project_name}-${var.environment}"

  selected_azs = length(var.availability_zones) > 0 ? var.availability_zones : slice(data.aws_availability_zones.available.names, 0, length(var.public_subnet_cidrs))

  public_subnet_map = {
    for idx, cidr in var.public_subnet_cidrs : idx => cidr
  }

  private_subnet_map = {
    for idx, cidr in var.private_subnet_cidrs : idx => cidr
  }
}
