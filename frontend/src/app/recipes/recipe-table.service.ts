import { Injectable } from '@angular/core';
import { TypeOption } from '../recipe.service';

@Injectable({
  providedIn: '***REMOVED***'
})
export class RecipeTableService {

  recipeTypes: TypeOption[] = []
  recipeOwners: TypeOption[] = []

}
