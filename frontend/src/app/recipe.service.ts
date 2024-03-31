import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Recipe } from './schema/recipe';
import { User } from './schema/user';
import { lastValueFrom } from 'rxjs';

export interface RecipeResponse<T> {
  data: T
  count?: number
  error?: { code: number, message: string },
  page?: number,
  totalRecordCount?: number
}

export interface TypeOption { label: string, value: string | null }

@Injectable({
  providedIn: '***REMOVED***'
})
export class RecipeService {

  constructor(
    private http: HttpClient
  ) { }

  get basePublicUrl() {
    return '/api';
  }

  getRecipesUrl() {
    return `${this.basePublicUrl}/recipes`
  }

  getRecipeUrl(id: number) {
    return `${this.getRecipesUrl()}/${id}`;
  }

  getRecipe(id: number) {
    return this.http.get<RecipeResponse<Recipe>>(this.getRecipeUrl(id));
  }

  getRecipes(page: number, count: number, query?: any) {
    let params = new HttpParams({
      fromObject: Object.assign({}, query, { page, count })
    });
    return this.http.get<RecipeResponse<Recipe[]>>(this.getRecipesUrl(), { params });
  }

  getRecipeOwners() {
    return this.http.get<RecipeResponse<User[]>>(`${this.getRecipesUrl()}/owners`, {});
  }

  getRecipeTypes() {
    return this.http.get<RecipeResponse<string[]>>(`${this.basePublicUrl}/recipe-types`);
  }

  saveRecipe(recipe: Recipe) {
    return lastValueFrom(this.http.post<RecipeResponse<Recipe>>(this.getRecipesUrl(), recipe));
  }

  deleteRecipe(recipe: Recipe) {
    return lastValueFrom(this.http.delete(this.getRecipeUrl(recipe.id as number)));
  }

  ownsRecipe(user: User, recipe: Recipe) {
    return !recipe.id || (recipe.userId === user.id) || user.userRole == 'admin';
  }

  cleanRecipeName(recipeName: string) {
    return recipeName.toLowerCase().replace(/\s/g, '-').replace(/[\(\)]/g, '');
  }

}
