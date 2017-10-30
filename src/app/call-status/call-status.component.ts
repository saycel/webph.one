import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CallSurveyService } from '../call-survey.service';

@Component({
  selector: 'app-call-status',
  templateUrl: './call-status.component.html',
  styleUrls: ['./call-status.component.scss']
})
export class CallStatusComponent implements OnDestroy {
  @Input() jsSipState: any;
  @Output() hangup: EventEmitter<any> = new EventEmitter();
  @Output() take: EventEmitter<any> = new EventEmitter();
  @Output() reject: EventEmitter<any> = new EventEmitter();
  constructor(public surveyService: CallSurveyService) { }

  ngOnDestroy() {
    if ( this.jsSipState.session && this.jsSipState.session.is_confirmed) {
      this.surveyService.set({
        user: this.jsSipState.session.local_identity.uri.user,
        timestamp: this.jsSipState.session.start_time
      });
    }
    return;
  }
}
