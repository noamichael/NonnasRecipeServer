terraform {
  backend "gcs" {
    bucket = "nr-tf-state-prod"
    prefix = "terraform/state"
  }
}