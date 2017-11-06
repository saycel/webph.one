import { Injectable } from '@angular/core';
import { JsSipService } from './jssip.service';

@Injectable()
export class SmsService {

  constructor(
    private _jsSipServie: JsSipService
  ) { }

  sendSms() {

  }

  reciveSms() {

  }

}
