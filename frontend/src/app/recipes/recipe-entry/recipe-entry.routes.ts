import { Routes } from "@angular/router";
import { CanActivateEntry, CanDeactivateEntry, RecipeEntryComponent, RecipeResolver } from "./recipe-entry.component";
import { RecipeDisplayComponent } from "./recipe-display/recipe-display.component";

export const routes: Routes = [
    {
        path: ':nickname',
        resolve: {
            recipe: RecipeResolver
        },
        children: [
            {
                path: '',
                component: RecipeDisplayComponent,
            },
            {
                path: 'edit',
                component: RecipeEntryComponent,
                canActivate: [CanActivateEntry],
                canDeactivate: [CanDeactivateEntry]
            }
        ]
    }

]