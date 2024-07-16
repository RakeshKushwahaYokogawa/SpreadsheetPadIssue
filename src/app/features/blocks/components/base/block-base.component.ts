import { OnInit, OnDestroy, Directive } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Dictionary } from '@syncfusion/ej2-angular-documenteditor';
import { Observable, of, combineLatest, Subject } from 'rxjs';
import {
  filter,
  switchMap,
  takeUntil,
  tap,
  debounceTime,
} from 'rxjs/operators';
import { Constants } from 'src/app/eln-web-app-common/app-constants';
import {
  IDynamicBlock,
  WorkflowModes,
} from 'src/app/eln-web-app-common/models/dynamic-block';
import { ITaskResponse } from 'src/app/eln-web-app-common/models/task.models';
import { IBlockFormGroup } from 'src/app/eln-web-app-common/models/temp-block.model';
import {
  IModifiedTemplateBlockField,
  ITemplateBlock,
  ITemplateBlockField,
} from 'src/app/eln-web-app-common/models/template.models';
import { IWorkflowMode } from 'src/app/eln-web-app-common/models/workflow-modes';
import { RedoUndoType } from 'src/app/eln-web-app-common/redo-undo/redo-undo.models';
import { RedoUndoService } from 'src/app/eln-web-app-common/redo-undo/redo-undo.service';
import { TempBlockStateService } from 'src/app/eln-web-app-common/states/temp-block-state/temp-block-state.service';
import { TemplateModesStateService } from 'src/app/eln-web-app-common/states/template-modes-state/template-modes-state.service';
import { TemplateStateService } from 'src/app/eln-web-app-common/states/template-state/template-state.service';

interface IWorkflowBlockData {
  blockData?: IModifiedTemplateBlockField;
  workflowModes: Array<IWorkflowMode>;
}

@Directive()
export abstract class BlockBaseComponent
  implements IDynamicBlock, OnInit, OnDestroy {
  abstract blockID: string;
  abstract childBlockId?: string;
  abstract workflowMode: WorkflowModes;
  expands: boolean[];

  abstract form: UntypedFormGroup;

  abstract ngOnInit(): void;
  abstract ngOnDestroy(): void;
  protected _workflowBlockData$: Observable<IWorkflowBlockData>;
  protected destroy$ = new Subject<void>();
  index: number;
  childIndex: number;
  isCompleteEnable: boolean = false;

  get inputMaxLength(): number {
    return Constants.DefaultInputMaxLength;
  }

  get acknowledgeLabelMaxLength(): number {
    return Constants.AcknowledgeLabelMaxLength;
  }


  public get getAllDateFieldKeys(): string[] {
    return [];
  }


  constructor(
    private templateStateService: TemplateStateService,
    private templateModesStateService: TemplateModesStateService,
    private tempBlockStateService: TempBlockStateService,
    private redoUndoService: RedoUndoService
  ) {
    this._workflowBlockData$ = combineLatest([
      this.templateStateService.getBlocksData(),
      this.templateModesStateService.getAvaibleModes(),
    ]).pipe(
      debounceTime(500),
      tap(([blockData, availableModes]) => {
        console.log('blockData', blockData);
        console.log('availableModes', availableModes);
      }),
      switchMap(([blocksData, availableModes]) => {
        let blockData: ITemplateBlock | undefined = blocksData?.find(
          (block) => block.id == this.blockID
        );
        if (blockData) {
          this.index = blocksData.indexOf(blockData)
        }
        if (this.childBlockId && blockData && blockData.childBlocks) {
          blockData = blockData.childBlocks.find(childBlock => childBlock.id == this.childBlockId);
          if (blockData)
            this.childIndex = blocksData.indexOf(blockData)
        }

        const modifiedBlockData: IModifiedTemplateBlockField | undefined =
          blockData == undefined ? undefined
            : {
              ...blockData,
              modifiedFields: new Dictionary<string, ITemplateBlockField>(),
            };
        if (modifiedBlockData && modifiedBlockData.fields) {
          modifiedBlockData.fields.forEach((field) => {
            if (modifiedBlockData.modifiedFields) {
              modifiedBlockData.modifiedFields.add(field.key, field);
            }
          });
        }
        const previousBlocks = blocksData?.slice(0, this.index);
        this.isCompleteEnable = previousBlocks.every(x => {
          if (!x.fields)
            return true;
          const field = x.fields.find(fieldItem => fieldItem.key == Constants.WorkflowLibrary.CommonFields.IsCompleted)
          return field && field.selected && field.value && field.value == 'true';
        });
        if (modifiedBlockData && modifiedBlockData.childBlocks) {
          this.expands = modifiedBlockData.childBlocks.map(() => true) ?? [];
        }

        return of({
          blockData: modifiedBlockData,
          workflowModes: availableModes,
        });
      }),
      tap((data) => {
        console.log('workflowBlockData', data);
      })
    );
  }

  getCurrentBlockData() {
    return this.templateStateService.getCurrentBlockData(this.blockID)
  }

  public getFieldDataByKey(
    fieldKey: string,
    block: ITemplateBlock
  ): ITemplateBlockField | unknown {
    return block.fields?.find((x) => x.key === fieldKey);
  }

  private saveValueChanges: boolean = true;

  private setValueForm(formValue: any) {
    this.saveValueChanges = false;
    this.form.setValue(formValue);
    this.saveValueChanges = true;
  }

  protected updateFormDataIfAvailable() {
    if (this.isFormDataAvailable())
      this.setValueForm(
        this.tempBlockStateService.getState().blockForm.get(this.blockID)
          .formData
      );
  }

  private isFormDataAvailable(): boolean {
    const tempBlock = this.tempBlockStateService.getState().blockForm.get(this.childBlockId ?? this.blockID)
    return tempBlock != null;
  }

  private getCurrentMode(workflowData: IWorkflowBlockData): string {
    return (
      workflowData.workflowModes.find((x) => x.value == this.workflowMode)
        ?.key ?? Constants.BlockModes.TaskView
    );
  }

  #toLocalDate(prevDate: string | undefined): string {
    if (!prevDate) {
      return ''
    }
    return new Date(prevDate).toString()
  }

  protected patchFormData(
    patchedValue: { [key: string]: string | undefined },
    fieldKey: string,
    controlName: string,
    workflowData: IWorkflowBlockData
  ) {
    const currentMode = this.getCurrentMode(workflowData);
    const isFormDataAvailable = this.isFormDataAvailable();
    if (isFormDataAvailable) {
      const blockForm = this.tempBlockStateService.getState().blockForm.get(this.childBlockId ?? this.blockID);
      if (blockForm.formData.hasOwnProperty(controlName))
        patchedValue = { [controlName]: blockForm.formData[controlName] };
    }
    if (patchedValue[controlName]) {
      if (this.getAllDateFieldKeys.some(key => key == controlName)) {
        patchedValue = {
          [controlName]: this.#toLocalDate(patchedValue[controlName]),
        };
      }
    }
    this.form.patchValue(patchedValue);
    this.setEnabledDisable(fieldKey, controlName, currentMode, workflowData.blockData);
  }

  private setEnabledDisable(
    fieldKey: string,
    controlName: string,
    currentMode: string,
    block: IModifiedTemplateBlockField | undefined
  ) {
    const control = this.getFormControl(controlName);
    if (control) {

      if (!block?.modifiedFields?.get(fieldKey)?.fieldEditableModes?.includes(currentMode) || !block?.fields?.find(x => x.key == fieldKey)?.selected) {
        control.disable({ emitEvent: false, onlySelf: true });
      } else {
        control.enable({ emitEvent: false, onlySelf: true });
      }
    }
  }

  public getFormControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

  public getCurrentFieldValue(fieldKey: string) {
    const template = this.templateStateService.getState();
    const block = template.blocks.find(x => x.id == this.blockID)
    if (block && block.fields) {
      const field = block.fields.find(x => x.key == fieldKey);
      if (field) {
        return field.value;
      }
    }
    return '';
  }

  private updateTempBlockState(id: string, form: IBlockFormGroup) {
    const keys = Object.keys(form.formData);
    const dateKeys = keys.filter(key => this.getAllDateFieldKeys.some(fieldKey => fieldKey == key));
    if (dateKeys && dateKeys.length > 0) {
      dateKeys.forEach(key => {
        form = {
          ...form,
          formData: {
            ...form.formData,
            [key]: form.formData[key] ? this.getFormattedDate(
              form.formData[key]
            ).toISOString() : '',
          },
        };
      })
    }
    this.tempBlockStateService.addOrUpdateTempBlockState(id, form);
  }

  getFormattedDate(value: string) {
    let date = new Date(value);
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    let utc = Date.UTC(y, m, d);
    return new Date(utc);
  }

  protected addChildBlock(childBlock: ITemplateBlock, title: string) {
    const templateData = this.templateStateService.getState();
    const block = templateData.blocks.find(blockItem => blockItem.id == this.blockID);
    if (block && block.childBlocks) {
      block.childBlocks.push({
        ...childBlock,
        title: title,
        fields: childBlock.fields ? childBlock.fields.map(field => {
          return { ...field }
        }) : [], id: new Date().getTime().toString()
      });
      this.templateStateService.updateTemplateBlocks(templateData.blocks);
      this.expands = block.childBlocks.map(() => true) ?? [];
      this.redoUndoService.addRedoUndoItem(RedoUndoType.BlockDragAndDrop, this.templateStateService.getState().blocks);
    }
  }

  protected addFormDataToRedoUndoIfNotAvailable() {
    if (!this.isFormDataAvailable()) {
      this.addFormDataToRedoUndo();
    }
  }

  private addFormDataToRedoUndo() {
    // TODO - need to fix for child block
    this.redoUndoService.addRedoUndoItem(RedoUndoType.BlockFormDataChanged, {
      id: this.blockID,
      touched: this.form.touched,
      dirty: this.form.dirty,
      valid: this.form.valid,
      disabled: this.form.disabled,
      formData: this.form.getRawValue(),
    });
  }

  protected onInit() {
    if (this.form) {
      this.form.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          filter(() => this.saveValueChanges),
          debounceTime(500)
        )
        .subscribe((data) => {
          const blockId = this.childBlockId ?? this.blockID;
          const block = this.templateStateService.getState().blocks.find(x => x.id == blockId);

          const formData: { [key: string]: string | undefined; } = {};
          const keys = Object.keys(data);
          keys.forEach((key) => {
            const control = this.form.get(key);
            if (control && control.valid) {
              formData[key] = control.value;
            }
          })

          this.updateTempBlockState(blockId, {
            touched: block?.newBlock ? true : this.form.touched,
            dirty: block?.newBlock ? true : this.form.dirty,
            valid: this.form.disabled || this.form.valid,
            disabled: this.form.disabled,
            formData: formData,
          });
          this.addFormDataToRedoUndo();
        });
      this.redoUndoService
        .getBlockDataChangeListener()
        .pipe(takeUntil(this.destroy$))
        .subscribe((redoUndoItem) => {
          if (RedoUndoService.isIBlockFormData(redoUndoItem.data)) {
            const redoUndoData = redoUndoItem.data;
            const blockId = this.childBlockId ?? this.blockID;
            const block = this.templateStateService.getState().blocks.find(x => x.id == blockId);
            this.updateTempBlockState(blockId, {
              touched: block?.newBlock ? true : redoUndoData.touched,
              dirty: block?.newBlock ? true : redoUndoData.dirty,
              valid: redoUndoData.valid,
              disabled: this.form.disabled,
              formData: redoUndoData.formData,
            });
            this.setValueForm(redoUndoData.formData);
          }
        });
    }
  }

  protected deleteChildBlock(childBlock: ITemplateBlock) {
    const templateState = this.templateStateService.getState();
    const block = templateState.blocks.find(blockItem => blockItem.id == this.blockID);
    const index = block?.childBlocks.findIndex(stateChildBlock => stateChildBlock.id == childBlock.id) ?? -1;
    if (index > -1 && block) {
      block.childBlocks.splice(index, 1);
      this.expands = block.childBlocks.map(() => true) ?? [];
    }
    this.templateStateService.updateTemplateBlocks(templateState.blocks);
    if (childBlock && childBlock.id) {
      this.tempBlockStateService.removeBlock(childBlock.id);
    }
  }

  protected updateTemplateFromBrowseTask(task: ITaskResponse) {
    this.templateStateService.updateTemplateFromBrowseTask(this.blockID, task);
  }

  blockComplete() {
    const subscription = this.tempBlockStateService.getTempBlockFieldValue(this.blockID, Constants.WorkflowLibrary.CommonFields.IsCompleted)
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (subscription) {
          if (value == 'true')
            this.templateStateService.blockComplete$.next(this.blockID);
          subscription.unsubscribe();
        }
      });
  }

  disableChildBlocks(childBlockIds: string[]) {
    this.templateStateService.disableChild$.next(childBlockIds);
  }

  blockApproveOrReject() {
    const subscription = this.tempBlockStateService.getTempBlockFieldValue(this.blockID, Constants.WorkflowLibrary.CommonFields.Action)
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (subscription) {
          if (value == 'true')
            this.templateStateService.blockApprove$.next(this.blockID);
          subscription.unsubscribe();
        }
      });
  }

  updateFormDetails() {
    if (this.childBlockId && this.blockID) {
      const formData = this.tempBlockStateService.getState();
      const parentBlockDate = formData.blockForm.get(this.blockID);
      if (parentBlockDate.disabled) {
        this.form.disable();
      }
    }
  }

  markTouchedAndDirty() {
    this.form.markAsTouched();
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  protected onDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
