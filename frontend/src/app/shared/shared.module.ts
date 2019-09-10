import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusDirective } from './focus.directive';

@NgModule({
  declarations: [FocusDirective],
  exports: [FocusDirective],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
