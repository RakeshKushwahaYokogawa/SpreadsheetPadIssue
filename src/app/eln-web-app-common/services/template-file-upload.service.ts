import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileResponse, IFileDataModel } from '../models/template.models';
import { ITaskResponse } from '../models/task.models';

@Injectable({
  providedIn: 'root'
})
export class TemplateFileUploadService {

  private filesToUpload: BehaviorSubject<IFileDataModel[]>;
  private filesToDelete: BehaviorSubject<IFileDataModel[]>;

  constructor() { }

  initFilesData() {
    this.filesToUpload = new BehaviorSubject<IFileDataModel[]>([]);
    this.filesToDelete = new BehaviorSubject<IFileDataModel[]>([]);
  }

  getRawFilesToUpload(): File[] {
    return this.filesToUpload.value.map(file => {
      return file.fileData.rawFile
    })
  }

  getFilePathToDelete(): string[] {
    return this.filesToDelete.value.map(file => {
      return file.path
    })
  }

  pushUploadFile(files: IFileDataModel[]) {
    this.filesToUpload.next([...this.filesToUpload.value, ...files])
  }

  pushDeleteFile(files: IFileDataModel[]) {
    this.filesToDelete.next([...this.filesToDelete.value, ...files])
  }

  isFileUploadRequired(): boolean {
    return this.filesToUpload.value && this.filesToUpload.value.length > 0;
  }

  isFileDeleteRequired(): boolean {
    return this.filesToDelete.value && this.filesToDelete.value.length > 0;
  }

  updateUploadedFilePath(filePaths: string[]) {
    this.filesToUpload.value.forEach((file: IFileDataModel, index: number) => {
      file.path = filePaths[index];
    })
  }

  addUploadedFileModel(model: ITaskResponse) {
    const blockIds = [...new Set(this.filesToUpload.value.map(x => x.blockId))];
    blockIds.forEach(blockId => {
      const fieldKeys = [...new Set(this.filesToUpload.value.filter(x => x.blockId == blockId).map(x => x.fieldKey))];
      const block = model.blocks.find(x => x.id == blockId);
      fieldKeys.forEach(fieldKey => {
        if (block && block.fields) {
          const field = block.fields.find(fieldItem => fieldItem.key == fieldKey);
          const uploadedFiles = this.filesToUpload.value.filter(x => x.blockId == blockId && x.fieldKey == fieldKey);
          const fieldValue: IFileDataModel[] = field && field.value ? JSON.parse(field.value) : [];
          fieldValue.push(...uploadedFiles.map(x => {
            return {
              id: x.id,
              name: x.name,
              size: x.size,
              path: x.path
            } as IFileDataModel
          }));
          if (field && fieldValue) {
            field.value = JSON.stringify(fieldValue);
          }
        }
      });
    });
  }

  removeDeletedFilesModel(model: ITaskResponse) {
    const blockIds = [...new Set(this.filesToDelete.value.map(x => x.blockId))];
    blockIds.forEach(blockId => {
      const fieldKeys = [...new Set(this.filesToDelete.value.filter(x => x.blockId == blockId).map(x => x.fieldKey))];
      const block = model.blocks.find(x => x.id == blockId);
      fieldKeys.forEach(fieldKey => {
        if (block && block.fields) {
          const field = block.fields.find(fieldItem => fieldItem.key == fieldKey);
          const deletedFileIdsForField = this.filesToDelete.value.filter(x => x.blockId == blockId && x.fieldKey == fieldKey).map(x => x.id);
          let fieldValue: IFileDataModel[] = field && field.value ? JSON.parse(field.value) : [];
          fieldValue = fieldValue.filter(x => !deletedFileIdsForField.includes(x.id));
          if (field && fieldValue) {
            field.value = JSON.stringify(fieldValue);
          }
        }
      });
    });
  }

  isSuccessInFileUpdate(model: ITaskResponse, fileUploadResponse: FileResponse, fileDeleteResponse: FileResponse) {
    let isSuccessInFileDelete = true;
    // delete
    if (fileDeleteResponse) {
      isSuccessInFileDelete = isSuccessInFileDelete && fileDeleteResponse.isSuccess;
      if (isSuccessInFileDelete) {
        this.removeDeletedFilesModel(model);
      }
    }
    // upload
    let isSuccessInFileUpdate = true;
    if (fileUploadResponse) {
      isSuccessInFileUpdate = isSuccessInFileUpdate && fileUploadResponse.isSuccess;
      if (isSuccessInFileUpdate) {
        this.updateUploadedFilePath(fileUploadResponse.filePath);
        this.addUploadedFileModel(model);
      }
    }
    return isSuccessInFileUpdate;
  }
}
