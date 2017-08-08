import { Component, OnInit } from '@angular/core';
import { ToneService } from './tone.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
  providers: [ToneService]
})
export class CallComponent implements OnInit {
  number: string = '';
  constructor(public toneService:ToneService) { }

  ngOnInit() {
  }

  pushItem(e) {
    this.toneService.start(e);
    this.number+=e;
  }

  clean() {
    this.number = '';
  }

}
