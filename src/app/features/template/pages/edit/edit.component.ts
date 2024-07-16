import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '@syncfusion/ej2-angular-documenteditor';
import { Subject, takeUntil, tap, of, lastValueFrom, take, Observable, combineLatestWith, concatMap, map } from 'rxjs';
import { Constants } from 'src/app/eln-web-app-common/app-constants';
import { WorkflowModes } from 'src/app/eln-web-app-common/models/dynamic-block';
import { IBlockFormGroup } from 'src/app/eln-web-app-common/models/temp-block.model';
import {
  IFileDataModel,
  ITemplateBlock,
  ITemplateResponse,
} from 'src/app/eln-web-app-common/models/template.models';
import { TemplateFileUploadService } from 'src/app/eln-web-app-common/services/template-file-upload.service';
import { TempBlockStateService } from 'src/app/eln-web-app-common/states/temp-block-state/temp-block-state.service';
import { TemplateStateService } from 'src/app/eln-web-app-common/states/template-state/template-state.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit, OnDestroy {

  public form: UntypedFormGroup;
  public form$: Observable<UntypedFormGroup>;
  public showConfig: boolean = true;
  public updateInProgress: boolean = false;
  public templateBlockId: string = '';
  protected destroy$ = new Subject<void>();
  templateName: string;

  templateId: string;
  templateData$: Observable<ITemplateResponse> = this.templateStateService.getTemplateData();
  workflowMode = WorkflowModes.TemplateCreation;
  blockState$: Observable<Dictionary<string, IBlockFormGroup>> =
    this.tempBlockStateService.getTempBlockState().pipe(
      tap((blockData) => {
        console.log(blockData);
      })
    );


  constructor(
    private route: ActivatedRoute,
    private templateStateService: TemplateStateService,
    private tempBlockStateService: TempBlockStateService,
    private templateFileUploadService: TemplateFileUploadService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.templateData$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.templateName = res.title;
      this.form = this.formBuilder.group({
        id: [res.id],
        title: [{ value: res.title, disabled: true }, Validators.compose([Validators.required, Validators.maxLength(128)])],
        version: [res.version],
        blockTypeId: [{ value: res.blockTypeId, disabled: true }, Validators.compose([Validators.required])],
        templateId: [res.templateId],
        isDraft: [res.isDraft]
      });
      this.form$ = of(this.form);
    });
  }

  ngOnInit() {
    this.templateId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.templateId != '') {
      this.templateStateService.initialize(this.templateId, '', false, true);
    }
  }

  onConfigClicked() {
    this.templateBlockId = '';
    this.showConfig = true;
  }

  openPropertyConfig(event: ITemplateBlock) {
    this.showConfig = true;
    this.templateBlockId = event.id ?? '';
  }

  createDuplicateBlock(block: ITemplateBlock) {
    this.templateStateService.createDuplicateBlock(block);
  }

  deleteBlock(block: ITemplateBlock) {
    this.tempBlockStateService.markAsDirty();
    this.templateStateService.deleteBlock(block);
  }

  #getFormData$(): Observable<IBlockFormGroup[]> {
    return this.templateStateService.getBlocksData().pipe(
      combineLatestWith(this.tempBlockStateService.getTempBlockState()), map(([blocks, formDataDict]) => ({ blocks, formDataDict })),
      concatMap(mergedData => {
        const blockIds = mergedData.blocks.map(block => [block.id, ...block.childBlocks.map(childBlock => childBlock.id)]).flat()
        const intersection = mergedData.formDataDict.keys.filter(x => blockIds.includes(x))
        return of(intersection.map(id => mergedData.formDataDict.get(id)));
      }))
  }

  isDirty(): Observable<boolean> {
    const tempBlocks = this.tempBlockStateService.getState();
    return this.#getFormData$().pipe(map(formData => formData.some(form => tempBlocks.dirty || (form.dirty && form.touched)) || this.form.dirty));
  }

  isValid(): Observable<boolean> {
    return this.#getFormData$().pipe(map(formData => formData.every(form => form.valid)));
  }

  async getTemplateData() {
    const templateState = this.templateStateService.getState();
    const form = await lastValueFrom(this.form$.pipe(take(1)));
    const rawValue = form.getRawValue();
    templateState.id = rawValue.id;
    templateState.blockTypeId = rawValue.blockTypeId;
    templateState.title = rawValue.title;
    templateState.version = rawValue.version.toString();
    templateState.templateId = rawValue.templateId;
    templateState.isDraft = rawValue.isDraft;
    this.updateBlocksFromForm(templateState)
    this.updateBlocksIndex(templateState);
    return templateState;
  }

  updateBlocksIndex(templateState: ITemplateResponse) {
    templateState.blocks.forEach((block) => {
      block.index = templateState.blocks.indexOf(block) + 1;
      if (block.childBlocks && block.childBlocks.length > 0) {
        block.childBlocks.forEach(childBlock => {
          childBlock.index = block.childBlocks.indexOf(childBlock) + 1;
        });
      }
    });
  }

  updateBlocksFromForm(templateState: ITemplateResponse) {
    const tempBlocks = this.tempBlockStateService.getState();
    templateState.blocks.forEach(block => {
      const blockForm = tempBlocks.blockForm.get(block.id ?? '');
      if (blockForm) {
        Object.keys(blockForm.formData).forEach(key => {
          const value = blockForm.formData[key];
          if (block && block.fields) {
            const field = block.fields.find(fieldItem => fieldItem.key == key);
            if (field) {
              field.value = value ? value.toString() : "";
            }
          }
        });

        block.childBlocks.forEach(childBlock => {
          if (childBlock && childBlock.id) {
            const blockChildForm = tempBlocks.blockForm.get(childBlock.id);
            if (blockChildForm) {
              Object.keys(blockChildForm.formData).forEach(key => {
                const value = blockChildForm.formData[key];
                if (childBlock.fields) {
                  const field = childBlock.fields.find(fieldItem => fieldItem.key == key);
                  if (field) {
                    field.value = value ? value.toString() : "";
                  }
                }
              });
            }
          }
        });
      }
    });
  }

  // Code to Prevent Page Load if Form is Dirty End
  enableDeactivateGuard: boolean = false;
  isFormValid = () => !this.isDirty();

  ngOnDestroy(): void {
    this.templateStateService.resetState();
  }
}
