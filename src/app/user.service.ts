import { Injectable } from '@angular/core';
import { NgServiceWorker, NgPushRegistration } from '@angular/service-worker';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StorageService, UserI} from './storage.service';

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
  private _pushNotificationServer = 'https://saycel.specialstories.org/push/';
  private _genericEmail = '@generic_email.saycel';

  private _prefix = '999100';
  private _ready = new BehaviorSubject(false);
  private registration: NgPushRegistration;

  constructor(
    private _storageService: StorageService,
    private _http: Http,
    private _ngServiceWorker: NgServiceWorker
    ) {
    _storageService
      .table('user')
      .read()
      .subscribe( x => {
       if (x.length > 0) {
          this._user.next(x[1]);
          this._ready.next(true);
       }
      });
  }

  userData() {
    return this._user;
  }

  createUser() {
    return new Promise((res, rej) => {
      this.getNumber()
        .map(response => response.json())
        .subscribe(
          (result: KamailioUserI ) => {
            this.register({user: result.user, password: result.pwd, email: result.email_address });
            res(this._user);
          },
          (error) => rej(error)
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

  isReady() {
    return this._ready;
  }

  isUser() {
    return this._user.getValue() !== undefined;
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
          console.error('error registering for push', err);
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
