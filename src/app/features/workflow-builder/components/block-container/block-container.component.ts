import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  HostListener,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Constants } from 'src/app/eln-web-app-common/app-constants';
import { WorkflowModes } from 'src/app/eln-web-app-common/models/dynamic-block';
import { ITemplateBlock } from 'src/app/eln-web-app-common/models/template.models';
import { RedoUndoType } from 'src/app/eln-web-app-common/redo-undo/redo-undo.models';
import { RedoUndoService } from 'src/app/eln-web-app-common/redo-undo/redo-undo.service';
import { ToastService } from 'src/app/eln-web-app-common/services/toast.service';
import { TemplateStateService } from 'src/app/eln-web-app-common/states/template-state/template-state.service';
import { WorkflowConfigStateService } from 'src/app/eln-web-app-common/states/workflow-config-state/workflow-config-state.service';

@Component({
  selector: 'eln-dynamic-block-container',
  templateUrl: './block-container.component.html',
  styleUrls: ['./block-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockContainerComponent {
  @Input() workflowMode: WorkflowModes;
  public expandAll: boolean = true;
  public expands: boolean[] = [];
  public blocks$: Observable<ITemplateBlock[]> = this.templateStateService
    .getBlocksData()
    .pipe(
      tap((blocks) => {
        if (blocks.length != this.expands.length) {
          this.expandAll = true;
          this.expands = blocks.map((block, i) => this.expands.length > i ? this.expands[i] : true);
        }
      })
    );

  @Output('on-config-clicked') onConfigPropertyClick = new EventEmitter<ITemplateBlock>();
  @Output() onDeleteBlock: EventEmitter<ITemplateBlock> = new EventEmitter<ITemplateBlock>();
  @Output() onCreateDuplicateBlock: EventEmitter<ITemplateBlock> = new EventEmitter<ITemplateBlock>();

  constructor(
    private templateStateService: TemplateStateService,
    private workflowConfigStateService:WorkflowConfigStateService,
    private redoUndoService: RedoUndoService,
    private toastService: ToastService) {
    this.redoUndoService.reset();
  }

  workflowConfigClicked(event: ITemplateBlock) {
    this.onConfigPropertyClick.emit(event);
  }

  createDuplicateBlock(block: ITemplateBlock) {
    if (this.templateStateService.getBlocksLength() >= Constants.MaxBlocksLengthInWorkflow) {
      this.toastService.showError(`MaxBlockReachedError`);
      return;
    }
    this.onCreateDuplicateBlock.emit(block)
  }

  deleteBlock(block: ITemplateBlock) {
    this.onDeleteBlock.emit(block);
  }

  isAllOpen() {
    const isOpen = this.expands.every((value) => value === true);
    return isOpen;
  }

  toggleExpand() {
    if (this.isAllOpen()) {
      this.expandAll = false;
    } else {
      this.expandAll = !this.expandAll;
    }
    this.expands = this.expands.map(() => this.expandAll);
  }

  onDropped(event: CdkDragDrop<ITemplateBlock[]>) {
    if (event.currentIndex == 0) {
      return;
    }
    if (this.templateStateService.getBlocksLength() >= Constants.MaxBlocksLengthInWorkflow) {
      this.toastService.showError(`MaxBlockReachedError`);
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const previousContainerData = [...event.previousContainer.data].map(
        (dataItem: ITemplateBlock, index: number) => {
          const title = "WorkflowConfiguration." + dataItem.componentKey + "." + dataItem.title + "." + dataItem.componentKey;
          return index === event.previousIndex
            ? {
              ...dataItem, title: title, id: new Date().getTime().toString(), childBlocks: [], childBlockOptions: dataItem.childBlocks, newBlock: true,
              fields: dataItem.fields ? dataItem.fields.map(field => {
                return { ...field }
              }) : []
            }
            : { ...dataItem };
        }
      );

      copyArrayItem(previousContainerData, event.container.data, event.previousIndex, event.currentIndex);
      this.expands.splice(event.currentIndex, 0, true);
      this.workflowConfigStateService.updateIsDroppedFromState(this.templateStateService.getState());
    }
    this.redoUndoService.addRedoUndoItem(RedoUndoType.BlockDragAndDrop, this.templateStateService.getState().blocks);
  }


  @HostListener('window:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent) {
    if (
      ($event.ctrlKey || $event.metaKey) &&
      $event.code.toLowerCase() === 'KeyZ'.toLowerCase()
    ) {
      this.redoUndoService.undo();
    }
    if (
      ($event.ctrlKey || $event.metaKey) &&
      $event.code.toLowerCase() === 'KeyY'.toLowerCase()
    ) {
      this.redoUndoService.redo();
    }
  }
}
