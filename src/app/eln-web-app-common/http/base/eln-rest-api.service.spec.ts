/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ElnRestApiService } from './eln-rest-api.service';

describe('Service: ElnRestApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElnRestApiService]
    });
  });

  it('should ...', inject([ElnRestApiService], (service: ElnRestApiService) => {
    expect(service).toBeTruthy();
  }));
});
