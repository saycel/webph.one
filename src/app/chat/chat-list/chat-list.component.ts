import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { SmsService } from '../../sms.service';

export enum MessageType {
  TEXT = <any>'text'
}

export interface ChatMessageI {
  _id?: string;
  chatId?: string;
  from?: string;
  content?: string;
  createdAt?: number;
  type?: MessageType;
}


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {
  public chatItems;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private router: Router,
    private _smsService: SmsService,
  ) { }

  ngOnInit() {
    this.chatItems = this._smsService
      .getAllChats()
      .takeUntil(this.ngUnsubscribe);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goTo(chatId: string) {
    console.log(chatId);
    this.router.navigate(['/chat', 'conversation', chatId ]);
  }
}
