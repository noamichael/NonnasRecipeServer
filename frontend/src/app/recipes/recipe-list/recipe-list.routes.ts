import { Routes } from "@angular/router";
import { RecipesResolver } from "../recipes.component";
import { RecipeListComponent } from "./recipe-list.component";

export const routes: Routes = [
    {
        path: "",
        component: RecipeListComponent,
        resolve: {
            recipes: RecipesResolver,
        },
    }
]