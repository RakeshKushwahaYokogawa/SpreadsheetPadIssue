/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { WorkflowConfigStateService } from './workflow-config-state.service';

describe('Service: WorkflowConfigState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowConfigStateService]
    });
  });

  it('should ...', inject([WorkflowConfigStateService], (service: WorkflowConfigStateService) => {
    expect(service).toBeTruthy();
  }));
});
