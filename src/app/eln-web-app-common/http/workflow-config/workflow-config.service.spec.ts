/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { WorkflowConfigService } from './workflow-config.service';

describe('Service: WorkflowConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowConfigService]
    });
  });

  it('should ...', inject([WorkflowConfigService], (service: WorkflowConfigService) => {
    expect(service).toBeTruthy();
  }));
});
