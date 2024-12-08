# Service Accounts
resource "google_service_account" "cloud_run_ci_cd" {
  account_id   = "cloud-run-ci-cd"
  display_name = "Cloud Run CI/CD Service Account"
}

resource "google_service_account" "backend" {
  account_id   = "nr-backend"
  display_name = "NR Backend Service Account"
}

# Backend Roles

resource "google_project_iam_member" "backend_cloud_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

resource "google_project_iam_member" "backend_secrets_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

resource "google_project_iam_member" "backend_artifact_registry_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

# Cloud Run CI CD Roles

# Maps this Google service account to the GitHub Actions
resource "google_service_account_iam_binding" "cloud_run_ci_cd_workload_pool" {
  depends_on         = [google_iam_workload_identity_pool.github]
  service_account_id = google_service_account.cloud_run_ci_cd.id
  role               = "roles/iam.workloadIdentityUser"
  members = [
    "principalSet://iam.googleapis.com/projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/github/attribute.repository/noamichael/NonnasRecipeServer"
  ]
}

resource "google_service_account_iam_binding" "cloud_run_ci_cd_service_identity" {
  service_account_id = google_service_account.backend.id
  role               = "roles/iam.serviceAccountUser"
  members = [
    "serviceAccount:${google_service_account.cloud_run_ci_cd.email}"
  ]
}

resource "google_project_iam_member" "cloud_run_ci_cd_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.cloud_run_ci_cd.email}"
}

resource "google_project_iam_member" "cloud_run_ci_cd_build_admin" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.editor"
  member  = "serviceAccount:${google_service_account.cloud_run_ci_cd.email}"
}

resource "google_project_iam_member" "cloud_run_ci_cd_artifact_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.cloud_run_ci_cd.email}"
}