import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallComponent } from './call.component';

const routes: Routes = [{
    path: '',
    component: CallComponent,
    pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallRoutingModule { }
