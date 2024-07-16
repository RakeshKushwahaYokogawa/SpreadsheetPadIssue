export interface IWorkflowTypes {
  types: Array<IWorkflowType>;
}

export interface IWorkflowType {
  key: string;
  value: string;
  requiredBlocks: string[]
}