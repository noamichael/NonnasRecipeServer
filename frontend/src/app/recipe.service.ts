import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Recipe } from './schema/recipe';

export interface RecipeResponse<T> {
  data: T
  count?: number
  error?: {code: number, message: string},
  page?: number,
  totalRecordCount?: number
}

export interface TypeOption { label: string, value: string }

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    private http: HttpClient
  ) { }

    get basePublicUrl(){
      return '/public-api';
    }

    get basePrivateUrl(){
      return '/private-api';
    }

    getRecipesUrl(local: boolean){
      return `${local ? this.basePrivateUrl : this.basePublicUrl}/recipes`
    }

    getRecipeUrl(id: number, local: boolean){
      return `${this.getRecipesUrl(local)}/${id}`;
    }

    getRecipe(id: number){
      return this.http.get<RecipeResponse<Recipe>>(this.getRecipeUrl(id, false));
    }

    getRecipes(page: number, count: number, query?: any){
      let params = new HttpParams({
        fromObject: Object.assign({}, query, {page, count})
      });
      return this.http.get<RecipeResponse<Recipe[]>>(this.getRecipesUrl(false), {params});
    }

    getRecipeTypes(){
      return this.http.get<RecipeResponse<string[]>>(`${this.basePublicUrl}/recipe-types`);
    }

    saveRecipe(recipe: Recipe){
      return this.http.post<RecipeResponse<Recipe>>(this.getRecipesUrl(true), recipe);
    }

    deleteRecipe(recipe: Recipe){
      return this.http.delete(this.getRecipeUrl(recipe.id, true));
    }
    
}
