import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import { Router } from '@angular/router';

import { ShareDialogComponent } from './share.dialog.component';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  constructor(public dialog: MdDialog, private router: Router) { }

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
    this.comment = '';
  }
}
