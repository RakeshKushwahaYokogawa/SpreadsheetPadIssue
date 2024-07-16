/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { RedoUndoService } from './redo-undo.service';

describe('Service: RedoUndo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedoUndoService]
    });
  });

  it('should ...', inject([RedoUndoService], (service: RedoUndoService) => {
    expect(service).toBeTruthy();
  }));
});
