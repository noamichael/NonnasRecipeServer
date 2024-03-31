
resource "google_project_service" "storage_api" {
  project = "${var.project_id}"
  service = "storage.googleapis.com"
}


resource "google_project_service" "cloud_run_api" {
  project = "${var.project_id}"
  service = "run.googleapis.com"
}