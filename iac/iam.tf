resource "google_service_account" "cloud_run_ci_cd" {
  account_id   = "cloud-run-ci-cd"
  display_name = "Cloud Run CI/CD Service Account"
}

resource "google_project_iam_member" "cloud_run_ci_cd_admin" {
  project = "${var.project_id}"
  role    = "roles/run.admin"
  member  = "${google_service_account.cloud_run_ci_cd.email}"
}

resource "google_project_iam_member" "cloud_run_ci_cd_build_admin" {
  project = "${var.project_id}"
  role    = "roles/cloudbuild.builds.editor"
  member  = "${google_service_account.cloud_run_ci_cd.email}"
}