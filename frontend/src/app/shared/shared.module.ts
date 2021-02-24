import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusDirective } from './focus.directive';
import { PopoverKeyboardDirective } from './popover-keyboard.directive';

@NgModule({
  declarations: [FocusDirective, PopoverKeyboardDirective],
  exports: [FocusDirective, PopoverKeyboardDirective],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
