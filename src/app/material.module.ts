import { NgModule } from '@angular/core';
import { MdTabsModule, MdToolbarModule, MdButtonModule, MdGridListModule, MdIconModule } from '@angular/material';

@NgModule({
  imports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule
  ],
  exports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule
  ],
})
export class CustomMaterialModule { }