import { RecipeStep } from './recipe-step';
import { Ingredient } from './ingredient';

export interface Recipe {
    id?: number
    recipeType?: string | null
    recipeName?: string | null
    cookTime?: number
    servingSize?: string
    points?: number,
    weightWatchers?: boolean
    steps: RecipeStep[]
    ingredients: Ingredient[]
    userId?: number
    userFullName?: string
}