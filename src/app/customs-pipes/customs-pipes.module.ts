import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneNumberPipe } from './phone-number.pipe';
import { InputPhonenumberDirective } from './input-phonenumber.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PhoneNumberPipe,
    InputPhonenumberDirective
  ],
  exports: [
    PhoneNumberPipe,
    InputPhonenumberDirective
  ]
})
export class CustomsPipesModule { }
