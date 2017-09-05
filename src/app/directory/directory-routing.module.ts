import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectoryComponent } from './directory.component'

const routes: Routes = [{
    path: 'directory',
    component: DirectoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'directory/:action/:number',
      component: DirectoryComponent,
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectoryRoutingModule { }
