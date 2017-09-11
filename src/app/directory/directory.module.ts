import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../material.module';
import { CustomsPipesModule } from '../customs-pipes/customs-pipes.module';

import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectoryComponent } from './directory.component';
import { ContactAddComponent } from './contact-add/contact-add.component';

@NgModule({
  imports: [
    CommonModule,
    DirectoryRoutingModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomsPipesModule
  ],
  declarations: [DirectoryComponent, ContactAddComponent]
})
export class DirectoryModule { }
