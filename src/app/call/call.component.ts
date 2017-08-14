import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ToneService } from '../tone.service';
import { JsSipService } from '../jssip.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {
  number = '';

  constructor(
    private toneService: ToneService,
    private jsSip: JsSipService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.number = this.route.snapshot.paramMap.get('number') || '';
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
