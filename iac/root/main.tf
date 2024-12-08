provider "google" {
  project = var.project_id
  region  = "us-east4"
}

data "google_project" "project" {
  project_id = var.project_id
}