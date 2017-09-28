import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../material.module';

import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share.component';
import { ShareDialogComponent } from './share.dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ShareRoutingModule,
    CustomMaterialModule,
    FormsModule
  ],
  declarations: [ShareComponent, ShareDialogComponent]
})
export class ShareModule { }
