terraform {
  backend "s3" {
    bucket         = "rentalapp-terraform-state-dev"
    key            = "environments/dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "rentalapp-terraform-locks"
  }
}
