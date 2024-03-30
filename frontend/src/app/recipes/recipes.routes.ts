import { RecipesComponent, RecipesOwnersResolver, RecipeTypesResolver } from './recipes.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    resolve: {
      recipeTypes: RecipeTypesResolver,
      recipeOwners: RecipesOwnersResolver
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./recipe-list/recipe-list.routes').then(m => m.routes)
      },
      {
        path: ':id',
        loadChildren: () => import('./recipe-entry/recipe-entry.routes').then(m => m.routes)
      }
    ]
  }
]