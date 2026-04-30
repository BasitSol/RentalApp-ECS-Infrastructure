terraform {
  backend "s3" {
    bucket         = "rentalapp-terraform-state-staging"
    key            = "environments/staging/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "rentalapp-terraform-locks"
  }
}
