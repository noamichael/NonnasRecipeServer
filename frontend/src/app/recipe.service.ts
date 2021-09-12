import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Recipe } from './schema/recipe';
import { User } from './schema/user';

export interface RecipeResponse<T> {
  data: T
  count?: number
  error?: { code: number, message: string },
  page?: number,
  totalRecordCount?: number
}

export interface TypeOption { label: string, value: string }

@Injectable()
export class RecipeService {

  constructor(
    private http: HttpClient
  ) { }

  get basePublicUrl() {
    return '/api';
  }


  bootstrap() {
    return Promise.resolve("ok");
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
     return this.http.get<RecipeResponse<User[]>>(`${this.getRecipesUrl()}/owners`, { });
  }

  getRecipeTypes() {
    return this.http.get<RecipeResponse<string[]>>(`${this.basePublicUrl}/recipe-types`);
  }

  saveRecipe(recipe: Recipe) {
    return this.http.post<RecipeResponse<Recipe>>(this.getRecipesUrl(), recipe);
  }

  deleteRecipe(recipe: Recipe) {
    return this.http.delete(this.getRecipeUrl(recipe.id));
  }

  ownsRecipe(user: User, recipe: Recipe) {
    return !recipe.id || (recipe.userId === user.id);
  }

  cleanRecipeName(recipeName: string) {
    return recipeName.toLowerCase().replace(/\s/g, '-').replace(/[\(\)]/g, '');
  }

}
