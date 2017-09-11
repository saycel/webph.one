import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneNumberPipe } from './phone-number.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PhoneNumberPipe
  ],
  exports: [
    PhoneNumberPipe
  ]
})
export class CustomsPipesModule { }
