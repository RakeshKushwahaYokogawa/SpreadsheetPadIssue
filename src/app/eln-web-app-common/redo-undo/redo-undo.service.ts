import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { LinkedList } from './linked-list/linked-list';
import {
  // RedoUndoData,
  RedoUndoItem,
  RedoUndoType,
  IBlockFormData,
} from './redo-undo.models';
import { ITemplateBlock } from '../models/template.models';

@Injectable({
  providedIn: 'root',
})
export class RedoUndoService implements OnDestroy {
  private readonly MAX_REDO_UNDO_LENGTH:number = 1;
  private redoStack = new LinkedList<RedoUndoItem>();
  private undoStack = new LinkedList<RedoUndoItem>();

  // private redoUndo$ = new Subject<RedoUndoItem>();
  private dragAndDrop$ = new Subject<RedoUndoItem>();
  private blockChange$ = new Subject<RedoUndoItem>();

  ngOnDestroy() {
    this.dragAndDrop$.complete();
    this.dragAndDrop$.unsubscribe();
    this.blockChange$.complete();
    this.blockChange$.unsubscribe();
  }

  private notifyDataChange(data: RedoUndoItem) {
    switch (data.type) {
      case RedoUndoType.BlockDragAndDrop:
        this.dragAndDrop$.next(data);
        break;
      case RedoUndoType.BlockFormDataChanged:
        this.blockChange$.next(data);
        break;
      default:
        break;
    }
  }

  public redo(): boolean {
    const headData = this.redoStack.peek();
    const canPerformRedo = headData != null;
    if (canPerformRedo) {
      this.undoStack.insertInEnd(headData.data);
      const item = headData.data;
      this.redoStack.deleteNode(headData);
      this.notifyDataChange(item);
    }
    return canPerformRedo;
  }

  public undo(): boolean {
    const headData = this.undoStack.peek();
    const canPerformUndo = headData != null && this.undoStack.size() > 1;
    if (canPerformUndo) {
      this.redoStack.insertInEnd(headData.data);
      this.undoStack.deleteNode(headData);
      const newHeadData = this.undoStack.peek();
      if (newHeadData) {
        this.notifyDataChange(newHeadData.data);
      }
    }
    return canPerformUndo;
  }

  public reset() {
    this.redoStack.reset();
    this.undoStack.reset();
  }

  public static isIBlockFormData(object: unknown): object is IBlockFormData {
    return (
      Object.prototype.hasOwnProperty.call(object, 'id') &&
      Object.prototype.hasOwnProperty.call(object, 'formData')
    );
  }

  public addRedoUndoItem(
    actionType: RedoUndoType,
    actionData: ITemplateBlock[] | IBlockFormData
  ): void {
    if (
      actionType == RedoUndoType.BlockDragAndDrop &&
      !(actionData instanceof Array)
    ) {
      throw new Error(
        'actionType RedoUndoType.BlockDragAndDrop require Array<ITemplateBlock>'
      );
    }
    if (
      actionType == RedoUndoType.BlockFormDataChanged &&
      !RedoUndoService.isIBlockFormData(actionData)
    ) {
      throw new Error(
        'actionType RedoUndoType.BlokFormDataChanged require IBlockFormData'
      );
    }
    this.redoStack.reset();
    const undoStackSize = this.undoStack.size();
    if (undoStackSize >= this.MAX_REDO_UNDO_LENGTH) {
      const nodeToRemove = this.undoStack.getFirst();
      if(nodeToRemove)
        this.undoStack.deleteNode(nodeToRemove);
    }
    this.undoStack.insertInEnd({
      type: actionType,
      data: actionData instanceof Array ? [...actionData] : { ...actionData },
    });
  }

  public getDragAndDropListener() {
    return this.dragAndDrop$;
  }
  public getBlockDataChangeListener() {
    return this.blockChange$;
  }
}
