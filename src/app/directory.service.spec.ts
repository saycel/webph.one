import { TestBed, inject } from '@angular/core/testing';

import { DirectoryService } from './directory.service';

describe('DirectoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectoryService]
    });
  });

  it('should be created', inject([DirectoryService], (service: DirectoryService) => {
    expect(service).toBeTruthy();
  }));
});
