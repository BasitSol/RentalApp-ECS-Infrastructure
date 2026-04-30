terraform {
  backend "s3" {
    bucket         = "rentalapp-terraform-state-prod"
    key            = "environments/production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "rentalapp-terraform-locks"
  }
}
