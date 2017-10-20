import { TestBed, inject } from '@angular/core/testing';

import { GuiNotificationsService } from './gui-notifications.service';

describe('GuiNotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuiNotificationsService]
    });
  });

  it('should be created', inject([GuiNotificationsService], (service: GuiNotificationsService) => {
    expect(service).toBeTruthy();
  }));
});
