terraform {
  backend "gcs" {
    bucket  = "nr-tf-state-dev"
    prefix  = "terraform/state"
  }
}