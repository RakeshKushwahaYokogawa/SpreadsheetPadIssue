import { Dictionary } from "@syncfusion/ej2-angular-documenteditor";

export interface ITemplateBlockField {
  id?: string;
  index: number;
  templateBlockId?: string;
  key: string;
  title: string;
  value?: string;
  repeatInput?: number;
  selected: boolean;
  disabled: boolean;
  isRepeatable: boolean;
  isNonConfigurable: boolean;
  fieldEditableModes: string[];
  isCalculated: boolean;
}

export interface IAssignedUser {
  id?: string;
  userId: string;
  userFullName: string;
  title: string;
  roleId: string;
  roleName: string;
  acceptStatus: any;
  duration: string;
  startDate: string;
  endDate: string;
  blockKey?: string;
}

export interface ITemplateBlock {
  id?: string;
  index: number;
  templateId?: string;
  parentBlockId?: string;
  title: string;
  componentKey: string;
  isRequired: boolean;
  isDuplicationAllowed: boolean;
  isDocked?: boolean;
  childBlocks: ITemplateBlock[];
  fields?: ITemplateBlockField[];
  newBlock?: boolean;

  childBlockOptions?: ITemplateBlock[];
  assignedUsers?: IAssignedUser[];
}

export interface IModifiedTemplateBlockField extends ITemplateBlock {
  modifiedFields: Dictionary<string, ITemplateBlockField>
}

export interface ITemplateMetaData {
  priority?: string;
  status?: string
}

export interface ITemplateResponse {
  id?: string;
  blockTypeId?: string;
  blockTypeName?: string;
  title: string;
  version: string;
  isDraft?: boolean;
  templateId?: string;
  lastModified?: string;
  blocks: ITemplateBlock[];
  isSuccess?: boolean;
  meta?: ITemplateMetaData;
  newTemplate?: boolean;
  isOldVersion?: boolean;
}

export interface ITemplateState extends ITemplateResponse {
  projectId: string;
}

export interface ITemplateExecuteState extends ITemplateState {
  taskTypeId?: string;
  referenceTemplateId?: string;
  referenceTemplateVersion?: string;
  lastModified?: string;
  isTask?: boolean;
}

export interface ITemplateBlockCompleted {
  isBlocksCompleted: boolean;
  isBlocksApproved: boolean;
}

export interface IFileDataModel {
  id: number;
  blockId: string;
  fieldKey: string;
  name: string;
  size: number;
  path: string;
  fileData: { rawFile: File, statusCode:number };
  isDeleted: boolean;
}

export interface FileResponse {
  isSuccess: boolean;
  statusCode: string;
  message: string;
  filePath: string[];
}