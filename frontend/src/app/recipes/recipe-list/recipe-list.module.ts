import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { RecipeListComponent } from './recipe-list.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { RecipesResolver } from '../recipes.component';

@NgModule({
  declarations: [RecipeListComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RecipeListComponent,
        resolve: {
          recipes: RecipesResolver
        }
      }
    ]),
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TriStateCheckboxModule
  ]
})
export class RecipeListModule { }
