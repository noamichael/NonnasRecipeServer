data "google_cloud_run_v2_service" "backend" {
  project  = var.project_id
  name     = "backend"
  location = "us-central1"
}