import { Component, OnInit } from '@angular/core';
import {trigger, transition, style, animate, state} from '@angular/animations';

import { GuiNotificationsService, GuiNotificactionI } from '../gui-notifications.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
  animations: [
    trigger(
      'toast',
      [
        transition(
        ':enter', [
          style({transform: 'translateY(-100%)', opacity: 0}),
          animate('250ms', style({transform: 'translateY(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateY(0)', 'opacity': 1}),
          animate('250ms', style({transform: 'translateY(-100%)', 'opacity': 0}))
        ]
      )]
    )
  ],
})
export class MessageBoxComponent implements OnInit {
  public msg: GuiNotificactionI = null;
  public timeout: any;
  constructor(notificationService: GuiNotificationsService) {
    notificationService.get().subscribe((data) => this.showNotification(data));
  }

  ngOnInit() {
  }

  showNotification(data: GuiNotificactionI) {
    this.msg = data;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.clearNotification(), data.timeout || 3000);
  }

  clearNotification() {
    this.msg = null;
  }

}
