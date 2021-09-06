import { RecipeStep } from './recipe-step';
import { Ingredient } from './ingredient';

export interface Recipe {
    id?: number
	recipeType?: string
	recipeName?: string
	cookTime?: number
    servingSize?: string
    points?: number,
    weightWatchers?: boolean
    steps: RecipeStep[]
    ingredients: Ingredient[]
    userId?: number
    userFulleName?: string
}