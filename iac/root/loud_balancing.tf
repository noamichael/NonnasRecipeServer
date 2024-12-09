
resource "google_compute_region_network_endpoint_group" "frontend_neg" {
  name                  = "serverless-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = data.google_cloud_run_v2_service.frontend.name
  }
}

module "lb-http" {
  source  = "terraform-google-modules/lb-http/google//modules/serverless_negs"
  version = "~> 12.0"

  name    = "frontend-lb"
  project = var.project_id

  ssl                             = true
  managed_ssl_certificate_domains = [var.domain]
  https_redirect                  = true

  backends = {
    default = {
      description = "Frontend's backend"
      groups = [
        {
          group = google_compute_region_network_endpoint_group.frontend_neg.id
        }
      ]

      enable_cdn = false

      iap_config = {
        enable = false
      }
      log_config = {
        enable = false
      }
    }
  }
}
