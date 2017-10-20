import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface GuiNotificactionI {
  text: string;
  icon?: string;
  show?: boolean;
  timeout?: number;
}

@Injectable()
export class GuiNotificationsService {
  public notification: Subject<GuiNotificactionI> = new Subject();
  constructor() {
  }

  send(data: GuiNotificactionI) {
    this.notification.next(data);
  }

  get() {
    return this.notification.asObservable();
  }
}
