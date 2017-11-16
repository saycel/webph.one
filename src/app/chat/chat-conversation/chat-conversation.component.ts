import { Component, OnInit, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { JsSipService } from '../../jssip.service';
import { SmsService } from '../../sms.service';
import { ChatMessageI } from '../chat-list/chat-list.component';

interface ConversationI {
  messages: ChatMessageI[];
  to?: string;
  chatId?: string;
  myNumber: string;
}

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public chat;
  public chatId;
  public fixed = false;
  public top: number;

  public message = '';

  constructor(
    private el: ElementRef,
    private _smsServie: SmsService,
    private _route: ActivatedRoute,
    private _jsSip: JsSipService,
  ) {}

  ngOnInit() {
    this.chatId = this._route.snapshot.paramMap.get('id') || '';
    this._smsServie
      .getChat(this.chatId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe( x => {
        this.chat = x;
        this._smsServie.markAsRead(x.chatId);
      });
    console.log('[SMS] - Chat in list', this.chat);
    this.top = this.el.nativeElement.parentElement.offsetTop - this.el.nativeElement.offsetTop;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
      console.log(window.scrollY + this.top);
      this.fixed = ((window.scrollY + this.top) > 0);
  }

  grow(event) {
    const element = event.target;
    element.style.height = '15px';
    element.style.height = (element.scrollHeight - 20) + 'px';
  }

  send() {
    this._smsServie.sendSms(this.message, this.chatId);
    this.message = null;
  }

  call() {
    this._jsSip.handleOutgoingCall('', this.chatId);
  }

  isDiferentDate(actual: number, prev: number = Date.now()) {
    const actualDate = new Date(actual);
    const prevDate = new Date(prev);
    return actualDate.toDateString() !== prevDate.toDateString();
  }
}
