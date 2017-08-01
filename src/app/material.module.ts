import { NgModule } from '@angular/core';
import { MdTabsModule, MdToolbarModule } from '@angular/material';

@NgModule({
  imports: [
    MdTabsModule,
    MdToolbarModule
  ],
  exports: [
    MdTabsModule,
    MdToolbarModule
  ],
})
export class CustomMaterialModule { }