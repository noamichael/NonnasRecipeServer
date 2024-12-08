variable "apis" {
  type = list(string)
  default = [ 
    "iam.googleapis.com",
    "storage.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com"
  ]
}

resource "google_project_service" "enable_service_usage" {
  project = "${var.project_id}"
  service = "serviceusage.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "enable_cloud_resource_manage" {
  project = "${var.project_id}"
  service = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "enable_api" {
  depends_on = [ google_project_service.enable_service_usage, google_project_service.enable_cloud_resource_manage]
  project = "${var.project_id}"
  for_each = toset(var.apis)
  service = each.value
  disable_on_destroy = false
}