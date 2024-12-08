resource "google_sql_database_instance" "nonnas_recipes" {
  name             = "nonnas-recipes"
  database_version = "MYSQL_8_0"
  region           = "us-central1"

  settings {
    # Second-generation instance tiers are based on the machine
    # type. See argument reference below.
    activation_policy = "ALWAYS"
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_type         = "PD_HDD"
    disk_size         = "10"

    backup_configuration {
      enabled  = true
      location = "us"
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    ip_configuration {
      ipv4_enabled = true
      ssl_mode     = "TRUSTED_CLIENT_CERTIFICATE_REQUIRED"
    }

    location_preference {
      zone = "us-central1-a"
    }

    maintenance_window {
      day  = "1"
      hour = "0"
    }


  }
}