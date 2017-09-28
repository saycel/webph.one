import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NgServiceWorker } from '@angular/service-worker';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomMaterialModule } from './material.module';

import { AppComponent } from './app.component';

import { CallModule } from './call/call.module';
import { DirectoryModule } from './directory/directory.module';

import { ToneService } from './tone.service';
import { JsSipService } from './jssip.service';
import { DirectoryService } from './directory.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { CallStatusComponent } from './call-status/call-status.component';

export const appRoutes: Routes  = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'call'
  },
  {
    path: 'call',
    loadChildren: './call/call.module#CallModule'
  },
  {
    path: 'directory',
    loadChildren: './directory/directory.module#DirectoryModule'
  },
  {
    path: '**',
    redirectTo: '/call',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    CallStatusComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: PreloadAllModules,
        useHash: true
      }
    ),
    CustomMaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    CallModule,
    DirectoryModule
  ],
  providers: [ToneService, JsSipService, DirectoryService, StorageService, UserService, NgServiceWorker],
  bootstrap: [AppComponent]
})
export class AppModule { }
