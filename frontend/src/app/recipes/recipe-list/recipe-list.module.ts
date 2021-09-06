import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DataViewModule } from "primeng/dataview";
import { CardModule } from "primeng/card";
import { RecipeListComponent } from "./recipe-list.component";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { TriStateCheckboxModule } from "primeng/tristatecheckbox";
import { RecipesResolver } from "../recipes.component";
import { SharedModule } from "src/app/shared/shared.module";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
  declarations: [RecipeListComponent],
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: RecipeListComponent,
        resolve: {
          recipes: RecipesResolver,
        },
      },
    ]),
    CommonModule,
    FormsModule,
    DataViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TriStateCheckboxModule,
    SharedModule,
    CheckboxModule,
  ],
})
export class RecipeListModule {}
