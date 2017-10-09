import { Component, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-call-survey',
  templateUrl: './call-survey.component.html',
  styleUrls: ['./call-survey.component.scss']
})
export class CallSurveyComponent {
  @Input() lastCall: any;
  @Output() clean: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();

  public issues = [
    { title: 'Long connection time', value: 'long_connection_time' },
    { title: 'Bad Audio', value: 'bad_audio' },
    { title: 'Did not connect', value: 'did_not_connect' },
    { title: 'Dropped Call', value: 'dropped_call' },
    { title: 'Others comments', value: 'others_comments' }
  ];

  constructor() { }

  setRating(number) {
    this.lastCall.rating = number;
  }

  setIssue(issue) {
    this.lastCall.issues = issue;
    if ( issue !== 'others_comments' ) {
      this.lastCall.comments = '';
    }
  }

  setComment(e) {
    this.lastCall.comments = e.target.value;
  }

  close() {
    this.clean.next();
  }

  send() {
    this.submit.next(this.lastCall);
  }
}
