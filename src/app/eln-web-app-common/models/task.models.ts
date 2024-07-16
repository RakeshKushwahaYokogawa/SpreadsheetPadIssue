import { ITemplateBlock } from "./template.models";

export interface ITaskModel {
    id?: string;
    taskTypeId: string;
    taskTypeName: string;
    title: string;
    projectId: string;
    referenceTemplateId: string;
    referenceTemplateVersion: string;
    blocks?: Array<ITemplateBlock>;

    stateId?: number;
}

export interface ITaskFieldModel {
    id: string;
    taskBlockId: string;
    key: string;
    title: string;
    value: string;
    selected: boolean;
    disabled: boolean;
    isRepeatable: boolean;
    isCalculated: boolean;
    isNonConfigurable: boolean;
    fieldEditableModes: Array<string>;
}

export interface ITaskResponse {
    id?: string;
    blockTypeId?: string;
    title: string;
    projectId: string;
    stateId?: number;
    referenceTemplateId?: string;
    referenceTemplateVersion?: string;
    lastModified?: string;
    blocks: Array<ITemplateBlock>;
    autoSave?: boolean;
    isComplete?:boolean;
}

