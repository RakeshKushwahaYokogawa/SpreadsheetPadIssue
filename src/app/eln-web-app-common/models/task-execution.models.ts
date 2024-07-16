export interface IWorkFlowFieldItem {
    id?: string;
    blockId?: string;
    childBlockId: string;
    fieldKey: string;
    value?: string;
}

export interface IWorkFlowExecutionModel {
    isDefinition: boolean;
    isDraft: boolean;
    isComplete: boolean;
    taskId: string;
    workFlowFieldItem: IWorkFlowFieldItem[];
}