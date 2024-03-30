import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, RouterOutlet } from '@angular/router';
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
     
      recipeTypes.unshift({ label: '-- Recipe Type --', value: '' });
      recipeOwners.unshift({ label: '-- Recipe Author --', value: '' });

      this.recipeTableService.recipeTypes = recipeTypes;
      this.recipeTableService.recipeOwners = recipeOwners;
    });
  }

}

@Injectable({
  providedIn: '***REMOVED***'
})
export class RecipesResolver implements Resolve<RecipeResponse<Recipe[]>> {

  constructor(
    private recipeService: RecipeService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const page = route.params["page"] || 1;
    const count = route.params["count"] || 25;

    return this.recipeService.getRecipes(page, count, route.params);
  }
}

@Injectable({
  providedIn: '***REMOVED***'
})
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