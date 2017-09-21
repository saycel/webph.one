import { Injectable } from '@angular/core';
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
  // private _kamailioUrl = 'http://localhost:8080/';
  private _prefix = '999100';
  private _ready = new BehaviorSubject(false);
  constructor(private _storageService: StorageService, private _http: Http) {
    _storageService
      .table('user')
      .read()
      .subscribe( x => {
        console.log('xxx', x, x[0], (typeof x[1] !== 'undefined'));
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
      email_address: Date.now() + '@test_number.saycel'
    }});
  }

  register(user: UserI) {
    console.log('Registring user', user);
    this._storageService
      .table('user')
      .create(user);
  }

  isReady() {
    return this._ready;
  }

  isUser() {
    return this._user.getValue() !== undefined;
  }
}
