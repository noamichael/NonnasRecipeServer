import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from '../../shared/shared.module';
import { RecipeEntryComponent, RecipeResolver, CanDeactivateEntry, CanActivateEntry } from './recipe-entry.component';
import { RecipeDisplayComponent } from './recipe-display/recipe-display.component';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [RecipeEntryComponent, RecipeDisplayComponent],
  providers: [RecipeResolver, CanActivateEntry, CanDeactivateEntry],
  imports: [
    RouterModule.forChild([
      {
        path: '',
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
    ]),
    CommonModule,
    FormsModule,
    PanelModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    FieldsetModule,
    ButtonModule,
    SharedModule,
    CardModule,
    ConfirmDialogModule
  ]
})
export class RecipeEntryModule { }
