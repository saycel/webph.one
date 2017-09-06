import { NgModule } from '@angular/core';
import {
  MdTabsModule,
  MdToolbarModule,
  MdButtonModule,
  MdGridListModule,
  MdIconModule,
  MdListModule,
  MdDialogModule,
  MdInputModule
} from '@angular/material';

@NgModule({
  imports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdDialogModule,
    MdInputModule
  ],
  exports: [
    MdTabsModule,
    MdToolbarModule,
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdDialogModule,
    MdInputModule
  ],
})
export class CustomMaterialModule { }
