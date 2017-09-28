import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ToneService } from './tone.service';
import { JsSipService } from './jssip.service';
import { DirectoryService } from './directory.service';
import { StorageService, UserI } from './storage.service';
import { UserService } from './user.service';

import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  links: any[] = [
    { label: 'Call', link: '/call' },
    { label: 'Directory', link: '/directory' }
  ];

  user: BehaviorSubject<UserI>;

  constructor(
    iconRegistry: MdIconRegistry,
    sanitizer: DomSanitizer,
    directoryService: DirectoryService,
    private userService: UserService,
    public jsSip: JsSipService,
    public http: Http
   ) {

    // Load directory and contacts from localstorage
    directoryService.get().subscribe();

    // Obtain the user in localStorage, if none is found, make a register and save it.
    userService.isReady().subscribe(
      (status: boolean) => {
        if (status === true && userService.isUser() === false) {
          userService.createUser();
        } else if (status === true && userService.isUser() === true) {
          jsSip.connect(userService.userData().getValue());
        }
      }
    );


    iconRegistry.addSvgIcon('call-end', sanitizer.bypassSecurityTrustResourceUrl('assets/call-end.svg'));
    iconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/call.svg'));
    iconRegistry.addSvgIcon('contact-add', sanitizer.bypassSecurityTrustResourceUrl('assets/contact-add.svg'));
    iconRegistry.addSvgIcon('arrow-down', sanitizer.bypassSecurityTrustResourceUrl('assets/arrow-down.svg'));
    iconRegistry.addSvgIcon('person', sanitizer.bypassSecurityTrustResourceUrl('assets/person.svg'));
  }
}
