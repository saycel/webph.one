import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { versions } from '../../environments/versions';
import { UserService, UserI } from '../user.service';
import { GuiNotificationsService } from '../gui-notifications.service';
import { ShareDialogComponent } from './share.dialog.component';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  constructor(
    public dialog: MdDialog,
    private router: Router,
    private _http: Http,
    private _userService: UserService,
    private _guiNotifications: GuiNotificationsService
  ) { }

  message = 'Try webph.one';
  href: string;
  comment: string;

  ngOnInit() {
    this.href = window.location.href.split(this.router.url)[0];
  }

  openShare() {
    const dialogRef = this.dialog.open(ShareDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.share(result);
    });
  }

  share(service: string) {
    let url: string;
    switch (service) {
      case 'whatsapp':
        url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(this.message + ' ' + this.href);
      break;
      case 'twitter':
        url = 'https://twitter.com/share?text=' + encodeURIComponent(this.message) + '&url=' + encodeURIComponent(this.href);
      break;
      case 'facebook':
        url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.href);
      break;
      default:
        return false;
    }
    window.open(url);
  }

  sendComments() {
    if (this.comment !== '') {
      const feedback = Object.assign({}, {
        comment: this.comment,
        user: this._userService.userData().getValue().user || 'no-user'
      }, versions);
      this._http.post('https://webphone.rhizomatica.org/webpush/feedback', feedback)
        .subscribe(
          (x) => {
            this._guiNotifications.send({text: 'Thank you for your feedback.'});
            this.comment = '';
          },
          (x) => this._guiNotifications.send({text: 'Something went wrong, we could not send the message.'})
        );
    }
    else {
      this._guiNotifications.send({text: 'Write some comments before sending.'});
    }
  }
}
