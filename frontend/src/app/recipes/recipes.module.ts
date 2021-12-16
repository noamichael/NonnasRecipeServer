import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesComponent, RecipesOwnersResolver, RecipesResolver, RecipeTypesResolver } from './recipes.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RecipesComponent],
  providers: [RecipesResolver, RecipeTypesResolver],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
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
            loadChildren: () => import('./recipe-list/recipe-list.module').then(m => m.RecipeListModule)
          },
          {
            path: ':id',
            loadChildren: () => import('./recipe-entry/recipe-entry.module').then(m => m.RecipeEntryModule)
          }
        ]
      }
    ])
  ]
})
export class RecipesModule { }
