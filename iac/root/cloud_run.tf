data "google_cloud_run_v2_service" "backend" {
  project  = var.project_id
  name     = "backend"
  location = var.region
}

data "google_cloud_run_v2_service" "frontend" {
  project  = var.project_id
  name     = "frontend"
  location = var.region
}