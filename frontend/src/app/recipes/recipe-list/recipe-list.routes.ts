import { Routes } from "@angular/router";
import { recipesResolver } from "../recipes.component";
import { RecipeListComponent } from "./recipe-list.component";

export const routes: Routes = [
    {
        path: "",
        component: RecipeListComponent,
        resolve: {
            recipes: recipesResolver,
        },
    }
]