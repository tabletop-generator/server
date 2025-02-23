module "ec2-instance" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "5.7.1"
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.10.0"
  # insert the 1 required variable here
}

resource "cloudflare_r2_bucket" "bucket" {
  account_id = var.cloudflare_account_id
  name = var.cloudflare_bucket_name
}
