/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { TempBlockStateService } from './temp-block-state.service';

describe('Service: TempBlockState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TempBlockStateService]
    });
  });

  it('should ...', inject([TempBlockStateService], (service: TempBlockStateService) => {
    expect(service).toBeTruthy();
  }));
});
