import { NgModule } from '@angular/core';
import { MdTabsModule, MdToolbarModule, MdButtonModule, MdGridListModule } from '@angular/material';

@NgModule({
  imports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule
  ],
  exports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule
  ],
})
export class CustomMaterialModule { }