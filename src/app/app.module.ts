import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'  ;

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomMaterialModule } from './material.module'

import { AppComponent } from './app.component';

import { CallModule } from './call/call.module';
import { DirectoryModule } from './directory/directory.module';
import { ShareModule } from './share/share.module';

export const appRoutes: Routes  = [
  {
    path:'',
    pathMatch:'full',
    redirectTo:'call'
  },
  {
    path:'call',
    loadChildren: './call/call.module#CallModule'
  },
  {
    path:'directory',
    loadChildren: './directory/directory.module#DirectoryModule'
  },
  {
    path:'share',
    loadChildren: './share/share.module#ShareModule'
  },
  { 
    path: '**',
    redirectTo: '/call',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: PreloadAllModules,
        useHash: true,
        enableTracing: true // <-- debugging purposes only
      }
    ),
    CustomMaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    CallModule,
    ShareModule,
    DirectoryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
