check "minimum_public_subnets" {
  assert {
    condition     = length(var.public_subnet_cidrs) >= 2
    error_message = "Provide at least two public subnet CIDRs for baseline high availability."
  }
}

check "subnet_pairing" {
  assert {
    condition     = length(var.public_subnet_cidrs) == length(var.private_subnet_cidrs)
    error_message = "public_subnet_cidrs and private_subnet_cidrs must have the same number of CIDRs."
  }
}

check "custom_domain_inputs" {
  assert {
    condition     = !var.enable_custom_domain || (var.domain_name != "" && var.route53_zone_id != "")
    error_message = "When enable_custom_domain=true, set both domain_name and route53_zone_id."
  }
}

check "ssm_inputs" {
  assert {
    condition = var.create_ssm_parameters ? (
      (var.enable_internal_mongo || var.mongodb_uri != null) && var.session_secret != null && var.jwt_secret != null
      ) : (
      var.existing_ssm_mongodb_uri_name != "" &&
      var.existing_ssm_session_secret_name != "" &&
      var.existing_ssm_jwt_secret_name != ""
    )
    error_message = "Provide secret values when create_ssm_parameters=true, or provide existing SSM names when create_ssm_parameters=false."
  }
}

check "elk_password_input" {
  assert {
    condition     = !var.elk_enabled || var.elasticsearch_password != ""
    error_message = "When elk_enabled=true, set elasticsearch_password so the ELK bootstrap secret is not empty."
  }
}
