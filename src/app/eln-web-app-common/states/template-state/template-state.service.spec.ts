/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { TemplateStateService } from './template-state.service';

describe('Service: TemplateState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateStateService]
    });
  });

  it('should ...', inject([TemplateStateService], (service: TemplateStateService) => {
    expect(service).toBeTruthy();
  }));
});
