import {
  Component,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  ViewChild,
  createNgModuleRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  IDynamicBlock,
  WorkflowModes,
} from 'src/app/eln-web-app-common/models/dynamic-block';
import { ITemplateBlock } from 'src/app/eln-web-app-common/models/template.models';
import { DynamicBlocksDirective } from '../../directives/dynamic-blocks/dynamic-blocks.directive';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/eln-web-app-common/app-constants';

@Component({
  selector: 'workflow-block[blockData][expand][index]',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocksComponent implements OnInit, OnChanges {
  @Input('index') index: number | string = -1;
  @Input('workflowMode') workflowMode: WorkflowModes;
  @Input() expand: boolean = false;
  @Output() expandChange = new EventEmitter<boolean>();
  @Input() parentBlockId?: string;
  @Input() blockData: ITemplateBlock;
  @Output() onConfigClick: EventEmitter<ITemplateBlock> = new EventEmitter<ITemplateBlock>();
  @Output() onDeleteBlock: EventEmitter<ITemplateBlock> = new EventEmitter<ITemplateBlock>();
  @Output() onCreateDuplicateBlock: EventEmitter<ITemplateBlock> = new EventEmitter<ITemplateBlock>();
  @ViewChild(DynamicBlocksDirective, { static: false })
  dynamicBlock: DynamicBlocksDirective;

  public editTitle: boolean = false;
  taskExecution = WorkflowModes.TaskExecution;
  taskView = WorkflowModes.TaskView;
  templateView = WorkflowModes.TemplateView;
  form: UntypedFormGroup;

  get inputMaxLength(): number {
    return Constants.DefaultInputMaxLength;
  }

  public get getTitleControl(): AbstractControl | null {
    return this.form.get('title');
  }

  public get allowedTitleEdit(): boolean {
    return [WorkflowModes.TemplateCreation, WorkflowModes.TaskCreation].some((mode: string) => mode == this.workflowMode) && !this.form.disabled
  }

  ngOnInit() {
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl("", [Validators.required])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expand']) {
      if (changes['expand'].currentValue) {
        this.addComponentDynamically();
      } else {
        this.removeComponentDynamically();
      }
    }
  }

  private async addComponentDynamically(): Promise<void> {
    let componentName: string;

    const blockData = this.blockData.componentKey;
    switch (blockData) {
      case 'DocumentationBlockComponent':
        componentName = 'documentation-block';
        break;
      case 'DefaultBlockComponent':
        componentName = 'general-block';
        break;
      case 'ResultBlockComponent':
        componentName = 'result-block';
        break;
      case 'ConsiderationBlockComponent':
        componentName = 'consideration-block';
        break;
      case 'ReviewBlockComponent':
        componentName = 'review-block';
        break;
      case 'ReferenceBlockComponent':
        componentName = 'reference-block';
        break;
      case 'ExperimentBlockComponent':
        componentName = 'experiment-block';
        break;
      case 'ExperimentStepBlock':
        componentName = 'experiment-step-block';
        break;
      case 'InstructionBlockComponent':
        componentName = 'instruction-block';
        break;
      case 'AcknowledgeBlock':
        componentName = 'acknowledge-block';
        break;
      case 'InventoryBlockComponent':
        componentName = 'inventory-block';
        break;
      default:
        componentName = 'dummy-block';
    }
    const { BlockComponent } = await import(
      `src/app/features/blocks/components/${componentName}/${componentName}.component`
    );
    const { BlocksModule } = await import(
      'src/app/features/blocks/blocks.module'
    );
    if (!this.dynamicBlock) {
      return;
    }
    const viewContainerRef = this.dynamicBlock.viewContainerRef;
    viewContainerRef.clear();
    const componentBlockHeaderRef =
      viewContainerRef.createComponent<IDynamicBlock>(BlockComponent, {
        ngModuleRef: createNgModuleRef(BlocksModule, viewContainerRef.injector),
      });
    if (this.parentBlockId) {
      componentBlockHeaderRef.instance.blockID = this.parentBlockId;
      componentBlockHeaderRef.instance.childBlockId = this.blockData.id ?? '';
    } else {
      componentBlockHeaderRef.instance.blockID = this.blockData.id ?? '';
    }
    componentBlockHeaderRef.instance.workflowMode = this.workflowMode;
    componentBlockHeaderRef.changeDetectorRef.detectChanges();
  }

  private removeComponentDynamically() {
    if (!this.dynamicBlock) {
      return;
    }
    const viewContainerRef = this.dynamicBlock.viewContainerRef;
    viewContainerRef.clear();
  }

  openPropertyConfig() {
    this.onConfigClick.emit(this.blockData);
  }

  editBlockTitle() {
    this.form.patchValue({
      title: this.blockData.title
    })
    this.editTitle = true;
  }

  updateBlockTitle() {
    if (this.getTitleControl && this.getTitleControl.value) {
      this.blockData.title = this.getTitleControl.value;
      this.editTitle = false;
    }
  }

  closeBlockTitle() {
    this.editTitle = false;
  }

  toggleExpand() {
    this.expandChange.emit(!this.expand);
  }

  createDuplicate() {
    this.onCreateDuplicateBlock.emit(this.blockData);
  }

  deleteBlock() {
    this.onDeleteBlock.emit(this.blockData);
  }

  changeDock() {
    this.blockData.isDocked = !this.blockData.isDocked;
  }
}
