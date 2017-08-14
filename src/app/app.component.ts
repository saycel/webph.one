import { Component } from '@angular/core';

import { ToneService } from './tone.service';
import { JsSipService } from './jssip.service';

import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  links: any[] = [{
    label: 'Call',
    link: '/call'
  },
  {
    label: 'Directory',
    link: '/directory'
  },
  {
    label: 'Share',
    link: '/share'
  }];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon('call-end', sanitizer.bypassSecurityTrustResourceUrl('assets/call-end.svg'));
        iconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/call.svg'));
  }
}
