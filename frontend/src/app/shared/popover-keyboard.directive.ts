import { Directive, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { KeyboardService, ActiveInput } from './keyboard.service';

@Directive({
  standalone: true,
  selector: 'input'
})
export class PopoverKeyboardDirective implements OnInit, OnDestroy, ActiveInput {

  constructor(
    private host: ElementRef,
    private control: NgControl,
    private keyboardService: KeyboardService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.keyboardService.destroyInput(this.getInput())
  }

  onChange(input: string) {
    input = input.trim()
    if (!input) {
      return;
    }
    this.host.nativeElement.value = input;
    this.readValueFromHost();
  }

  onKeyPress(input: string) {
    const el = this.host.nativeElement;
    switch (input) {
      case "{bksp}":
        el.value = el.value.substring(0, el.value.length - 1);
        break;
    }
    this.readValueFromHost();
  }

  readValueFromHost() {
    this.control.viewToModelUpdate(this.host.nativeElement.value);
  }

  getInput(): HTMLInputElement {
    return this.host.nativeElement;
  }

  @HostListener("focus")
  onInputFocus() {
    this.keyboardService.setActiveInput(this);
    if (this.keyboardService.enabled) {
      this.getInput().scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }

}
