import { TestBed } from '@angular/core/testing';

import { ComunicationsService } from './comunications.service';

describe('ComunicationsService', () => {
  let service: ComunicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
