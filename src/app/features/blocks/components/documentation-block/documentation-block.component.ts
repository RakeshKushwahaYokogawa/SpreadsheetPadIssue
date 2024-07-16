import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { ISelectListItem } from 'src/app/eln-web-app-common/models/common-model';
import { WorkflowModes } from 'src/app/eln-web-app-common/models/dynamic-block';
import { RedoUndoService } from 'src/app/eln-web-app-common/redo-undo/redo-undo.service';
import { TempBlockStateService } from 'src/app/eln-web-app-common/states/temp-block-state/temp-block-state.service';
import { TemplateModesStateService } from 'src/app/eln-web-app-common/states/template-modes-state/template-modes-state.service';
import { TemplateStateService } from 'src/app/eln-web-app-common/states/template-state/template-state.service';
import { BlockBaseComponent } from '../base/block-base.component';
import { TemplateService } from 'src/app/eln-web-app-common/http/template/template.service';
import { IAssignedUser } from 'src/app/eln-web-app-common/models/template.models';
import { Constants } from 'src/app/eln-web-app-common/app-constants';


@Component({
  selector: 'app-documentation-block',
  templateUrl: './documentation-block.component.html',
  styleUrls: ['./documentation-block.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockComponent extends BlockBaseComponent implements OnInit, OnDestroy {
  @Input() blockID: string;
  @Input() childBlockId: string;
  @Input() workflowMode: WorkflowModes;


  get constants(): typeof Constants.WorkflowLibrary.DocumentationBlock.Fields {
    return Constants.WorkflowLibrary.DocumentationBlock.Fields;
  }

  public get getMaxLengthForVersion(): number {
    return Constants.MaxLengthForVersion;
  }


  workflowBlockData$ = this._workflowBlockData$.pipe(
    tap((workflowData) => {
      const block = workflowData.blockData;
      if (block && block.fields) {
        block.fields.forEach((fieldData) => {
          if (this.form) {
            switch (fieldData.key) {
              case this.constants.EditorType:
                this.patchFormData({ [this.constants.EditorType]: fieldData.value ?? '' }, fieldData.key, this.constants.EditorType, workflowData);
                break;
              case this.constants.Documentation:
                this.patchFormData({ [this.constants.Documentation]: fieldData.value }, fieldData.key, this.constants.Documentation, workflowData);
                if (this.formDocumentation) {
                  if (this.formEditorType) {
                    if (this.formEditorType.value == Constants.DocumentationType.Document && this.formDocument) {
                      this.formDocument.patchValue(this.formDocumentation.value ?? fieldData.value);
                      if (this.formDocumentation.disabled) {
                        this.formDocument.disable();
                      }
                    }
                    if (this.formEditorType.value == Constants.DocumentationType.Spreadsheet && this.formSpreadsheet) {
                      this.formSpreadsheet.patchValue(this.formDocumentation.value ?? fieldData.value);
                      if (this.formDocumentation.disabled) {
                        this.formSpreadsheet.disable();
                      }
                    }
                  }
                }

                break;
              default:
                break;
            }
          }
        });
      }
      this.addFormDataToRedoUndoIfNotAvailable();
    })
  );

  public get formEditorType(): AbstractControl | null {
    return this.form.get(this.constants.EditorType)
  }

  public get formDocumentation(): AbstractControl | null {
    return this.form.get(this.constants.Documentation)
  }

  public get formDocument(): AbstractControl | null {
    return this.form.get('documentation')
  }

  public get formSpreadsheet(): AbstractControl | null {
    return this.form.get('spreadsheet')
  }

  form: UntypedFormGroup;

  editorTypes = new Array<ISelectListItem>();
  projectId: string;

  constructor(
    templateStateService: TemplateStateService,
    templateModesStateService: TemplateModesStateService,
    tempBlockStateService: TempBlockStateService,
    private templateService: TemplateService,
    redoUndoService: RedoUndoService,
    private formBuilder: UntypedFormBuilder,
  ) {
    super(
      templateStateService,
      templateModesStateService,
      tempBlockStateService,
      redoUndoService
    );
    templateStateService
      .getProjectId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pId) => {
        this.projectId = pId;
      });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      [this.constants.DocumentId]: [''],
      [this.constants.EditorType]: ['', Validators.compose([Validators.required])],
      [this.constants.Documentation]: [''],
      documentation: [''],
      spreadsheet: [''],
    });
    if (this.formDocument) {
      this.formDocument.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
        if (this.formEditorType) {
          if (this.formEditorType.value == Constants.DocumentationType.Document) {
            this.form.patchValue({ [this.constants.Documentation]: value });
          }
        }
      })
    }
    if (this.formSpreadsheet) {
      this.formSpreadsheet.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
        if (this.formEditorType) {
          if (this.formEditorType.value == Constants.DocumentationType.Spreadsheet) {
            this.form.patchValue({ [this.constants.Documentation]: value });
          }
        }
      })
    }

    this.getEditorType();
    this.onInit();
  }

  typeChange() {
    if (this.formEditorType) {
      this.formEditorType.markAsTouched();
    }
  }

  getEditorType() {
    let editorData = this.templateService.getEditorType();
    Object.assign(this.editorTypes, editorData);
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
