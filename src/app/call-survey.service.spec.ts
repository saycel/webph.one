import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';

import { MockBackend } from '@angular/http/testing';
import { CallSurveyService } from './call-survey.service';

const testData = {
    rating: 5,
    issues: 'NOT_CONNECT',
    comments: 'simple string',
    timestamp: Date.now(),
    user: '123456',
    branch: 'no-branch',
    revision: 'no-revision'
};

describe('Call Survey Service', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        CallSurveyService,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  describe('Manage state', () => {

    it('should celan survey data',
        inject([CallSurveyService, XHRBackend], (callSurveyService, mockBackend) => {
        expect(callSurveyService.clean()).toEqual(null);
    }));

    it('should change survey data',
        inject([CallSurveyService, XHRBackend], (callSurveyService, mockBackend) => {
        callSurveyService.set(testData);
        expect(testData).toEqual(callSurveyService.lastCall);
    }));
  });

  describe('Send data to server', () => {
    it('should return an Observable',
        inject([CallSurveyService, XHRBackend], (callSurveyService, mockBackend) => {

        const mockResponse = {
          status: 200
        };

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        callSurveyService.submit(testData).subscribe((res) => {
            expect(res._body).toEqual('{"status":200}');
        });

    }));
  });
});
