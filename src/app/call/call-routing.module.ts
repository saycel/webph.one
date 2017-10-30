import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallComponent } from './call.component';

const routes: Routes = [{
    path: 'call',
    component: CallComponent,
    pathMatch: 'full'
},
{
    path: 'call/answer/:answer',
    component: CallComponent,
    pathMatch: 'full'
},
{
    path: 'call/:number',
    component: CallComponent,
    pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallRoutingModule { }
