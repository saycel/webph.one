import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectoryComponent } from './directory.component';

@NgModule({
  imports: [
    CommonModule,
    DirectoryRoutingModule
  ],
  declarations: [DirectoryComponent]
})
export class DirectoryModule { }
