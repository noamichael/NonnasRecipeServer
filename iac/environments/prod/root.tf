module "root" {
  source     = "../../root"
  project_id = "trans-radius-98822"
}

import {
  id = "projects/trans-radius-98822/instances/nonnas-recipes"
  to = module.root.google_sql_database_instance.nonnas_recipes
}
