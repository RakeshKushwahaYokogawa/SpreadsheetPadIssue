import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import {
  ITemplateBlock,
  ITemplateBlockCompleted,
  ITemplateBlockField,
  ITemplateExecuteState,
  ITemplateResponse,
} from '../../models/template.models';
import { Injectable, OnDestroy } from '@angular/core';
import { BaseStateService } from '../base-state/base-state.service';
import { TemplateService } from 'src/app/eln-web-app-common/http/template/template.service';
import { RedoUndoService } from '../../redo-undo/redo-undo.service';
import { IBlockFormData, RedoUndoType } from '../../redo-undo/redo-undo.models';
import { ITaskResponse } from '../../models/task.models';
import { TempBlockStateService } from '../temp-block-state/temp-block-state.service';
import { Constants } from '../../app-constants';

const initialSate: ITemplateExecuteState = {
  id: '',
  blockTypeId: '',
  title: '',
  version: Constants.DefaultVersion,
  isDraft: false,
  templateId: '',
  lastModified: '',
  blocks: [],
  isSuccess: false,
  projectId: '',
  isTask: false,
  newTemplate: false
};

@Injectable({
  providedIn: 'root',
})
export class TemplateStateService
  extends BaseStateService<ITemplateExecuteState>
  implements OnDestroy {
  get constants(): typeof Constants.WorkflowLibrary.DocumentationBlock.Fields {
    return Constants.WorkflowLibrary.DocumentationBlock.Fields;
  }

  private destroy$ = new Subject<void>();
  documentId: string;

  blockComplete$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  blockApprove$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  disableChild$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  blocksContainerAssignUsers = [
    Constants.WorkflowLibrary.DocumentationBlock.Fields.AssignUser
  ];

  constructor(
    private templateService: TemplateService,
    private redoUndoService: RedoUndoService,
    private tempBlockStateService: TempBlockStateService
  ) {
    super(initialSate);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  private getInitialStateData() {
    this.blockComplete$ = new BehaviorSubject<string>('');
    this.blockApprove$ = new BehaviorSubject<string>('');
    this.tempBlockStateService.reset();
    return { ...initialSate, blocks: [] }
  }

  public initializeEmpty(blockTypeId: string, projectId: string = '', newTemplate: boolean = false) {
    const templateData = { ...this.getInitialStateData(), blockTypeId: blockTypeId, projectId: projectId, newTemplate: newTemplate }
    this.setState(templateData);
  }

  public updateByExistingModel(model: ITemplateExecuteState) {
    const templateData = { ...model }
    this.setState(templateData);
  }

  public initialize(withTemplateId: string, projectId: string = '', saveAs: boolean = false, withDraft: boolean = false) {
    this.setState(this.getInitialStateData());

    this.templateService
      .getTemplateById(withTemplateId, withDraft)
      .pipe(takeUntil(this.destroy$))
      .subscribe((templateData) => {
        this.redoUndoService.reset();
        this.redoUndoService.addRedoUndoItem(
          RedoUndoType.BlockDragAndDrop,
          templateData.blocks
        );
        if (saveAs) {
          templateData.templateId = '';
          templateData.id = '';
        }
        this.setState({ ...templateData, version: saveAs ? Constants.DefaultVersion : templateData.version, projectId });
      });

    this.redoUndoService
      .getDragAndDropListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((redoUndoData) => {
        if (redoUndoData) {
          const redoUndoBlockData: ITemplateBlock[] | IBlockFormData =
            redoUndoData.data;
          if (!RedoUndoService.isIBlockFormData(redoUndoBlockData))
            this.setState({ blocks: [...redoUndoBlockData] });
        }
      });
  }

  public getTemplateData(): Observable<ITemplateResponse> {
    return this.select((state) => state);
  }

  public getBlocksData(): Observable<Array<ITemplateBlock>> {
    return this.select((state) => state.blocks);
  }

  public getCurrentBlockData(blockId: string): ITemplateBlock | null {
    return this.state.blocks.find(x => x.id == blockId) ?? null;
  }

  public getBlocksLength(): number {
    return this.state.blocks.length ?? 0;
  }

  // public getBlockData(withID: string): Observable<ITemplateBlock | undefined> {
  //   if (!withID) return of(undefined);
  //   return this.select((state) =>
  //     state.blocks.find((block) => block.id == withID)
  //   );
  // }

  public updateTemplateFieldData(
    updatedField: ITemplateBlockField,
    blockId: string
  ) {
    const block = this.state.blocks.find((blockItem) => blockItem.id == blockId);
    if (block) {
      if (block.fields) {
        const newFields = block.fields.map((field) =>
          field.key == updatedField.key ? updatedField : field
        );
        block.fields = [...newFields];
        const newBlocks = this.state.blocks.map((blockItem) =>
          blockItem.id == blockId ? block : blockItem
        );
        this.setState({ blocks: [...newBlocks] });
      }
    }
  }

  public updateTemplateChildBlockFieldData(
    updatedField: ITemplateBlockField,
    blockId: string,
    childBlockId: string
  ) {
    const block = this.state.blocks.find((blockItem) => blockItem.id == blockId);
    if (block) {
      const childBlock = block.childBlocks.find((childBlockItem) => childBlockItem.id == childBlockId);
      if (childBlock && childBlock.fields) {
        const newFields = childBlock.fields.map((field) =>
          field.key == updatedField.key ? updatedField : field
        );
        childBlock.fields = [...newFields];
        const newChildBlocks = block.childBlocks.map((childBlockItem) =>
          childBlockItem.id == blockId ? childBlock : childBlockItem
        );
        block.childBlocks = [...newChildBlocks];
        const newBlocks = this.state.blocks.map((blockItem) =>
          blockItem.id == blockId ? block : blockItem
        );
        this.setState({ blocks: [...newBlocks] });
      }
    }
  }

  public addRequiredTemplateBlocks(blocks: ITemplateBlock[]) {
    this.setState({ blocks: [...blocks] });
  }

  public updateTemplateBlocks(blocks: ITemplateBlock[]) {
    this.setState({ blocks: blocks });
  }

  public getState(): ITemplateExecuteState {
    return this.state;
  }

  public getProjectId(): Observable<string> {
    return this.select((state) => state.projectId);
  }

  public getTaskId(): Observable<string> {
    return this.select((state) => this.state.isTask ? state.id ?? '' : '');
  }

  public createDuplicateBlock(block: ITemplateBlock) {
    const tempBlocksState = this.tempBlockStateService.getState();
    let duplicateBlock = {
      ...block,
      newBlock: true,
      id: new Date().getTime().toString(),
      fields: block.fields ? block.fields.map((field) => {
        return { ...field };
      }) : [],
      childBlocks: block.childBlocks.map((childBlock) => {
        return {
          ...childBlock, fields: childBlock.fields ? childBlock.fields.map((field) => {
            return { ...field };
          }) : []
        };
      }),
    };
    if (tempBlocksState && block.id) {
      const fieldFormData = tempBlocksState.blockForm.get(block.id);
      if (fieldFormData) {
        duplicateBlock.fields.forEach(field => {
          field.value = fieldFormData.formData[field.key];
        });
      }
      duplicateBlock.childBlocks.forEach(childBlock => {
        if (childBlock.id) {
          const childFieldFormData = tempBlocksState.blockForm.get(childBlock.id);
          if (childBlock.fields && childFieldFormData) {
            childBlock.fields.forEach(field => {
              field.value = childFieldFormData.formData[field.key];
            })
          }
        }
      })
    }
    const index = this.state.blocks.indexOf(block);
    this.state.blocks.splice(index + 1, 0, duplicateBlock);
    this.setState({ blocks: [...this.state.blocks] });
  }

  public updateTemplateFromBrowseTask(blockId: string, task: ITaskResponse) {
    const componentKeys: string[] = [];
    const startIndex = this.state.blocks.findIndex((block: ITemplateBlock) => blockId == block.id);
    const addBlocks = task.blocks.filter((block: ITemplateBlock) => componentKeys.indexOf(block.componentKey) != -1);
    const blocks = this.state.blocks.filter((block: ITemplateBlock) => blockId != block.id)
    addBlocks.forEach((block: ITemplateBlock, index: number) => {
      blocks.splice(startIndex + index, 0, {
        ...block,
        id: `${new Date().getTime().toString()}_${index}`,
        index: startIndex + index,
        childBlocks: block.childBlocks.map(childBlock => {
          return { ...childBlock }
        })
      });
    });
    blocks.forEach((block, index) => {
      block.index = index + 1;
      if (block.childBlocks && block.childBlocks.length > 0) {
        block.childBlocks.forEach((childBlock, childIndex) => {
          childBlock.index = childIndex + 1;
        });
      }
    });
    this.setState({ ...this.state, blocks: [...blocks] });
  }

  deleteBlock(block: ITemplateBlock) {
    if (block && block.id) {
      const templateState = this.state;

      const deletedBlock = templateState.blocks.find((stateBlock) => stateBlock.id != block.id);
      if (deletedBlock && deletedBlock.childBlocks && deletedBlock.childBlocks.length > 0) {
        deletedBlock.childBlocks.forEach(childBlock => {
          if (childBlock && childBlock.id)
            this.tempBlockStateService.removeBlock(childBlock.id);
        })
      }

      const filteredBlocks = templateState.blocks.filter(
        (stateBlock) => stateBlock.id != block.id
      );
      templateState.blocks = filteredBlocks;
      this.updateTemplateBlocks(templateState.blocks);
      this.tempBlockStateService.removeBlock(block.id);
    }
  }

  blockComplete(): Observable<string> {
    return this.blockComplete$.asObservable();
  }

  disableChild(): Observable<string[]> {
    return this.disableChild$.asObservable();
  }

  blockApprove(): Observable<string> {
    return this.blockApprove$.asObservable();
  }

  isCompletedAllBlocks(): Observable<ITemplateBlockCompleted> {
    return this.select(state => {
      const isCompleteExist = state.blocks.some(block => {
        if (!block.fields)
          return true;
        const field = block.fields.find(fieldItem => fieldItem.key == Constants.WorkflowLibrary.CommonFields.IsCompleted)
        return field && field.selected;
      })
      const isApproveExist = state.blocks.some(block => {
        if (!block.fields)
          return true;
        const field = block.fields.find(fieldItem => fieldItem.key == Constants.WorkflowLibrary.CommonFields.Action)
        return field && field.selected;
      })
      return {
        isBlocksCompleted: isCompleteExist ? state.blocks.filter(block => {
          if (!block.fields)
            return true;
          const field = block.fields.find(fieldItem => fieldItem.key == Constants.WorkflowLibrary.CommonFields.IsCompleted)
          return field && field.selected;
        }).every(block => {
          if (!block.fields)
            return true;
          const field = block.fields.find(fieldItem => fieldItem.key == Constants.WorkflowLibrary.CommonFields.IsCompleted)
          return field && field.selected && field.value && field.value == 'true';
        }) : true,

        isBlocksApproved: isApproveExist ? state.blocks.filter(block => {
          if (!block.fields)
            return true;
          const field = block.fields.find(fieldItem => fieldItem.key == Constants.WorkflowLibrary.CommonFields.Action)
          return field && field.selected;
        }).every(block => {
          if (!block.fields)
            return true;
          const field = block.fields.find(fieldItem => fieldItem.key == Constants.WorkflowLibrary.CommonFields.Action)
          return field && field.selected && field.value && field.value == 'true';
        }) : true
      } as ITemplateBlockCompleted
    });
  }

  resetState() {
    this.setState(this.getInitialStateData());
  }
}
