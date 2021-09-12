import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { RecipeResponse, RecipeService } from '../recipe.service';
import { Recipe } from '../schema/recipe';
import { User } from '../schema/user';
import { RecipeTableService } from './recipe-table.service';

@Component({
  selector: 'nr-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeTableService]
})
export class RecipesComponent implements OnInit {

  constructor(
    private recipeTableService: RecipeTableService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const recipeTypes = data.recipeTypes.data.map(s => { return { label: s, value: s } });
      const recipeOwners = data.recipeOwners.data.map(s => ( { label: s.name, value: `${s.id}` }));
     
      recipeTypes.unshift({ label: '-- Recipe Type --', value: null });
      recipeOwners.unshift({ label: '-- Recipe Author --', value: null });

      this.recipeTableService.recipeTypes = recipeTypes;
      this.recipeTableService.recipeOwners = recipeOwners;
    });
  }

}

@Injectable()
export class RecipesResolver implements Resolve<RecipeResponse<Recipe[]>> {

  constructor(
    private recipeService: RecipeService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const page = route.params.page || 1;
    const count = route.params.count || 25;

    return this.recipeService.getRecipes(page, count, route.params);
  }
}

@Injectable()
export class RecipeTypesResolver implements Resolve<RecipeResponse<string[]>> {

  constructor(
    private recipeService: RecipeService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.recipeService.getRecipeTypes();
  }
}

@Injectable({
  providedIn: '***REMOVED***'
})
export class RecipesOwnersResolver implements Resolve<RecipeResponse<User[]>> {

  constructor(
    private recipeService: RecipeService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.recipeService.getRecipeOwners();
  }
}