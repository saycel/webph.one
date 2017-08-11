import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';
import { Component, HostListener } from '@angular/core';
import { ToneService } from './tone.service';
import { JsSipService } from './jssip.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
   providers: [ JsSipService, ToneService]
})
export class CallComponent {
  number = '';

  constructor(
    public toneService: ToneService,
    public jsSip: JsSipService,
    iconRegistry: MdIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
        'call-end',
        sanitizer.bypassSecurityTrustResourceUrl('assets/call-end.svg'));
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const reg = new RegExp('^[0-9]');
    if (reg.test(event.key)) {
      this.pushItem(event.key);
    }
  }

  pushItem(e) {
    this.toneService.start(e);
    this.number += e;
  }

  clean() {
    this.number = this.number.substring(0, this.number.length - 1);
  }

  call() {
    this.jsSip.handleOutgoingCall('', this.number);
  }

  hangup() {
    this.jsSip.handleHangup();
  }
}
