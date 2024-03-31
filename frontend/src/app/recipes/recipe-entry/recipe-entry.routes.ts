import { Routes } from "@angular/router";
import { canActivateEntry, canDeactivateEntry, RecipeEntryComponent, recipeResolver } from "./recipe-entry.component";
import { RecipeDisplayComponent } from "./recipe-display/recipe-display.component";

export const routes: Routes = [
    {
        path: ':nickname',
        resolve: {
            recipe: recipeResolver
        },
        children: [
            {
                path: '',
                component: RecipeDisplayComponent,
            },
            {
                path: 'edit',
                component: RecipeEntryComponent,
                canActivate: [canActivateEntry],
                canDeactivate: [canDeactivateEntry]
            }
        ]
    }

]