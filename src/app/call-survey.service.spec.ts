import { TestBed, inject } from '@angular/core/testing';

import { CallSurveyService } from './call-survey.service';

describe('CallSurveyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallSurveyService]
    });
  });

  it('should be created', inject([CallSurveyService], (service: CallSurveyService) => {
    expect(service).toBeTruthy();
  }));
});
