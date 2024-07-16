import { TestBed } from '@angular/core/testing';

import { TemplateTypeStateService } from './template-type-state.service';

describe('TemplateTypeStateService', () => {
  let service: TemplateTypeStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateTypeStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
