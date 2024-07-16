/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TemplateFileUploadService } from './template-file-upload.service';

describe('Service: TemplateFileUpload', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateFileUploadService]
    });
  });

  it('should ...', inject([TemplateFileUploadService], (service: TemplateFileUploadService) => {
    expect(service).toBeTruthy();
  }));
});
