import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';

import { versions } from '../environments/versions';

@Injectable()
export class CallSurveyService {
  public lastCall: any;
  private _endpoint = environment.endpoint + 'survey';
  constructor(private _http: Http) {
    this.lastCall = null;
   }

  clean() {
    console.log('SURVEY - CLEAN');
    this.lastCall = null;
    return this.lastCall;
  }

  set(data) {
    console.log('SURVEY - SET', data);
    this.lastCall = data;
    return this.lastCall;
  }

  submit(event) {
    this.clean();
    return this._http.post(this._endpoint, {
      rating: event.rating,
      issues: event.issues,
      comments: event.comments,
      timestamp: event.timestamp,
      user: event.user,
      branch: versions.branch || 'no-branch',
      revision: versions.revision || 'no-revision'
    });
  }
}
