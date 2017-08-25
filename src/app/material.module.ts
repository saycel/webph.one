import { NgModule } from '@angular/core';
import {
  MdTabsModule,
  MdToolbarModule,
  MdButtonModule,
  MdGridListModule,
  MdIconModule,
  MdListModule,
  MdDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdDialogModule
  ],
  exports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdDialogModule
  ],
})
export class CustomMaterialModule { }
