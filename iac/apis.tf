variable "apis" {
  type = list(string)
  default = [ 
    "iam.googleapis.com",
    "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "storage.googleapis.com",
    "run.googleapis.com"
  ]
}

resource "google_project_service" "enable_api" {
  project = "${var.project_id}"
  for_each = toset(var.apis)
  service = each.value
}