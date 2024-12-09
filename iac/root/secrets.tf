resource "google_secret_manager_secret" "database_username" {
  secret_id = "database-username"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "databases_password" {
  secret_id = "database-password"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "google_client_id" {
  secret_id = "google-client-id"

  replication {
    auto {}
  }
}
