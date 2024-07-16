import { TestBed } from '@angular/core/testing';

import { TemplateModesStateService } from './template-modes-state.service';

describe('TemplateModesStateService', () => {
  let service: TemplateModesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateModesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
