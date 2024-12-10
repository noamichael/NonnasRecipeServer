resource "google_cloud_run_domain_mapping" "frontend" {
  name     = var.domain
  location = var.region
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = "frontend"
  }
}
