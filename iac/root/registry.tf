resource "google_artifact_registry_repository" "docker_prod" {
  project       = var.project_id
  repository_id = "docker"
  format        = "DOCKER"
  description   = "Docker Repository for Images"

  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 5
    }
  }

}