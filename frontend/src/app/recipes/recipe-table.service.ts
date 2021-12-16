import { Injectable } from '@angular/core';
import { TypeOption } from '../recipe.service';

@Injectable()
export class RecipeTableService {

  recipeTypes: TypeOption[]
  recipeOwners: TypeOption[]

  constructor() { }
}
