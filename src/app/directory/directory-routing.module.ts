import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectoryComponent } from './directory.component';
import { ContactAddComponent } from './contact-add/contact-add.component';

const routes: Routes = [{
    path: 'directory',
    component: DirectoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'directory/:action/:number',
      component: ContactAddComponent,
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectoryRoutingModule { }
