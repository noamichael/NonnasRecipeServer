import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[nrFocus]'
})
export class FocusDirective implements OnChanges {

  @Input('nrFocus')
  nrFocus: boolean

  constructor(
    private el: ElementRef<HTMLElement>
  ) { }

  ngOnChanges(changes: SimpleChanges){
    if(this.nrFocus){
      setTimeout(() => {
        this.el.nativeElement.focus();
      });
    }
  }

}
