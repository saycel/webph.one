import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-call-status',
  templateUrl: './call-status.component.html',
  styleUrls: ['./call-status.component.scss']
})
export class CallStatusComponent {
  @Input() jsSipState: any;
  @Output() hangup: EventEmitter<any> = new EventEmitter();
  @Output() take: EventEmitter<any> = new EventEmitter();
  @Output() reject: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
