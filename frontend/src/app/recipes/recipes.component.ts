import { Component, OnInit, Injectable, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet, ResolveFn } from '@angular/router';
import { Recipe } from '../schema/recipe';
import { User } from '../schema/user';
import { RecipeTableService } from './recipe-table.service';
import { RecipeResponse, RecipeService, TypeOption } from '../recipe.service';

@Component({
  standalone: true,
  selector: 'nr-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [RecipeTableService],
  imports: [
    RouterOutlet
  ]
  
})
export class RecipesComponent implements OnInit {

  constructor(
    private recipeTableService: RecipeTableService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const recipeTypes: TypeOption[] = (data["recipeTypes"].data as string[]).map(s => { return { label: s, value: s } });
      const recipeOwners: TypeOption[] = (data["recipeOwners"].data as User[]).map(s => ( { label: s.name, value: `${s.id}` }));
     
      recipeTypes.unshift({ label: '-- Recipe Type --', value: null });
      recipeOwners.unshift({ label: '-- Recipe Author --', value: null });

      this.recipeTableService.recipeTypes = recipeTypes;
      this.recipeTableService.recipeOwners = recipeOwners;
    });
  }

}

export const recipesResolver: ResolveFn<RecipeResponse<Recipe[]>> = (route) => {
  const page = route.params["page"] || 1;
  const count = route.params["count"] || 25;
  return inject(RecipeService).getRecipes(page, count, route.params);
};

export const recipeTypesResolver: ResolveFn<RecipeResponse<string[]>> = () => {
  return inject(RecipeService).getRecipeTypes();
}

export const recipesOwnersResolver: ResolveFn<RecipeResponse<User[]>> = () => {
  return inject(RecipeService).getRecipeOwners();
}
