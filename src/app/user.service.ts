import { Injectable } from '@angular/core';
import { NgServiceWorker, NgPushRegistration } from '@angular/service-worker';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GuiNotificationsService } from './gui-notifications.service';

import { StorageService } from './storage.service';

export interface AuthKeysI {
  auth: string;
  p256dh: string;
}

export interface PushDataI {
  endpoint: string;
  expirationTime?: string;
  keys: AuthKeysI;
  p256dh: string;
}

export interface UserI {
  email?: string;
  user?: string;
  password?: string;
  _id?: string;
  id?: string;
  push?: PushDataI;
}

interface KamailioUserI {
  pwd: string;
  user: string;
  status: string;
  msg: string;
  email_address: string;
}

@Injectable()
export class UserService {
  private _user = new BehaviorSubject<UserI>({});
  private _kamailioUrl = 'https://saycel.specialstories.org/cgi-bin/allocatenumber.py';
  private _pushNotificationServer = 'https://webphone.rhizomatica.org/webpush/';
  private _genericEmail = '@generic_email.saycel';

  private _prefix = '999200';
  private _ready = new BehaviorSubject(false);
  private _busy = false;
  private registration: NgPushRegistration;

  constructor(
    private _storageService: StorageService,
    private _http: Http,
    private _ngServiceWorker: NgServiceWorker,
    private _guiNotification: GuiNotificationsService
    ) {
    _storageService
      .table('user')
      .read()
      .subscribe( (x: UserI[]) => {
          if (x.length > 0) {
            this._user.next(x[0]);
          }
          this._ready.next(true);
      });
  }

  userData() {
    return this._user;
  }

  createUser() {
    return new Promise((res, rej) => {
      if (this._busy === true) {
        rej('Registration in process.');
      }
      this._busy = true;
      this.getNumber()
        .map(response => response.json())
        .subscribe(
          (result: KamailioUserI ) => {
            this.register({user: result.user, password: result.pwd, email: result.email_address });
            res(this._user);
          },
          (error) => {
            this._busy = false;
            rej(error);
          }
        );
    });
  }

  getNumber() {
    return this._http.get(this._kamailioUrl, { params: {
      prefix: this._prefix,
      email_address: Date.now() + this._genericEmail
    }});
  }

  register(user: UserI) {
    this._storageService
      .table('user')
      .create(user);
    this.subscribeToPush(user);
  }

  isUser() {
    return new Promise((res, rej) => {
      this._ready.subscribe((status) => {
        if (status === true) {
          res(typeof this._user.getValue().user !== 'undefined');
        }
      });
    });
  }

  subscribeToPush(user: UserI) {
    this._http.get(this._pushNotificationServer + 'publicKey')
    .map(x => x.json())
    .subscribe(result => {
      this._ngServiceWorker.registerForPush({
        applicationServerKey: result.key
      }).subscribe(
        (r: NgPushRegistration) => {
          this.sendRegistration(r, user);
        },
        err => {
          if ( err ) {
            console.log('[PUSH NOTIFICATIONS] - Error on registration', err); 
            this._guiNotification.send({
              text:'You have denied permission to show notifications. This permission is used to let you know when there is an incoming call when you have the application closed or in the background.',
              timeout: 10000
            });
          }
        }
      );
    });
  }

  sendRegistration(r: NgPushRegistration, user: UserI) {
    const rJson: any = r.toJSON();
    this._http.post(this._pushNotificationServer + 'save', {
      user: user.user,
      endpoint: rJson.endpoint,
      auth: rJson.keys.auth,
      p256dh: rJson.keys.p256dh
    }).subscribe(x => {
      this._storageService
        .table('user')
        .update(Object.assign({},
          this._user.getValue(),
          { push: rJson }
        ));
    });
  }
}
