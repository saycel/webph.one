import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from '../material.module';

import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectoryComponent } from './directory.component';

@NgModule({
  imports: [
    CommonModule,
    DirectoryRoutingModule,
    CustomMaterialModule
  ],
  declarations: [DirectoryComponent]
})
export class DirectoryModule { }
