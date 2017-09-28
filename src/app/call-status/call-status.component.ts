import { Component, OnInit } from '@angular/core';
import { JsSipService } from '../jssip.service';

@Component({
  selector: 'app-call-status',
  templateUrl: './call-status.component.html',
  styleUrls: ['./call-status.component.scss']
})
export class CallStatusComponent implements OnInit {

  constructor(
    public jsSip: JsSipService,
  ) { }

  ngOnInit() {
  }

  hangup() {
    this.jsSip.handleHangup();
  }

  takeIncomming() {
    this.jsSip.handleAnswerIncoming();
  }

  rejectIncomming() {
    this.jsSip.handleRejectIncoming();
  }

}
