resource "google_artifact_registry_repository" "docker_prod" {
  project       = var.project_id
  repository_id = "docker"
  format        = "DOCKER"
  description   = "Docker Repository for Images"
}