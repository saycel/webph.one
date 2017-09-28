import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareComponent } from './share.component';
import { ShareDialogComponent } from './share.dialog.component';

const routes: Routes = [{
    path: 'share',
    component: ShareComponent,
    pathMatch: 'full'
  }, {
    path: 'share/dialog',
    component: ShareDialogComponent,
    pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareRoutingModule { }
