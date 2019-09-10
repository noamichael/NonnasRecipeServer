import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesComponent, RecipesResolver, RecipeTypesResolver } from './recipes.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RecipesComponent],
  providers: [RecipesResolver, RecipeTypesResolver],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RecipesComponent,
        resolve: {
          recipeTypes: RecipeTypesResolver
        },
        children: [
          {
            path: '',
            loadChildren: './recipe-list/recipe-list.module#RecipeListModule'
          },
          {
            path: ':id',
            loadChildren: './recipe-entry/recipe-entry.module#RecipeEntryModule'
          }
        ]
      }
    ])
  ]
})
export class RecipesModule { }
