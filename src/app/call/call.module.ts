import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallRoutingModule } from './call-routing.module';
import { CallComponent } from './call.component';

@NgModule({
  imports: [
    CommonModule,
    CallRoutingModule
  ],
  declarations: [CallComponent]
})
export class CallModule { }
