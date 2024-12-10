module "root" {
  source     = "../../root"
  project_id = "trans-radius-98822"
}

import {
  id = "projects/trans-radius-98822/instances/nonnas-recipes"
  to = module.root.google_sql_database_instance.nonnas_recipes
}

import {
  id = "projects/trans-radius-98822/serviceAccounts/cloud-run-ci-cd@trans-radius-98822.iam.gserviceaccount.com"
  to = module.root.google_service_account.cloud_run_ci_cd
}

import {
  id = "projects/trans-radius-98822/serviceAccounts/nr-backend@trans-radius-98822.iam.gserviceaccount.com"
  to = module.root.google_service_account.backend
}
