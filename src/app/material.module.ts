import { NgModule } from '@angular/core';
import {
  MdTabsModule,
  MdToolbarModule,
  MdButtonModule,
  MdGridListModule,
  MdIconModule,
  MdListModule
} from '@angular/material';

@NgModule({
  imports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule
  ],
  exports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule
  ],
})
export class CustomMaterialModule { }
