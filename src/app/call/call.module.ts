import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from '../material.module';
import { CustomsPipesModule } from '../customs-pipes/customs-pipes.module';

import { CallRoutingModule } from './call-routing.module';
import { CallComponent } from './call.component';

@NgModule({
  imports: [
    CommonModule,
    CallRoutingModule,
    CustomMaterialModule,
    CustomsPipesModule
  ],
  declarations: [CallComponent]
})
export class CallModule { }
