import { IBlockFormGroup } from '../models/temp-block.model';
import { ITemplateBlock } from '../models/template.models';

export interface IBlockFormData extends IBlockFormGroup {
  id: string;
}

export enum RedoUndoType {
  BlockDragAndDrop,
  BlockFormDataChanged
}

export interface RedoUndoItem {
  type: RedoUndoType;
  data: ITemplateBlock[] | IBlockFormData;
}
