import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import { PhoneNumberPipe } from './phone-number.pipe';

@Directive({
  selector: '[appInputPhonenumber]',
  providers: [PhoneNumberPipe]
})
export class InputPhonenumberDirective implements OnInit {

  private el: HTMLInputElement;

  constructor(
    private _elementRef: ElementRef,
    private _phoneNumberPipe: PhoneNumberPipe
  ) {
    this.el = this._elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this._phoneNumberPipe.transform(this.el.value);
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value) {
    this.el.value = this._phoneNumberPipe.parse(value); // opossite of transform
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.el.value = this._phoneNumberPipe.transform(value);
  }

}
