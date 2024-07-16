export interface IDynamicBlock {
  blockID: string;
  childBlockId?: string;
  workflowMode: WorkflowModes;
  ngOnInit(): void;
  ngOnDestroy(): void;
}

export enum WorkflowModes {
  TemplateCreation = 'TemplateCreation',
  TemplateView = 'TemplateView',
  TaskCreation = 'TaskCreation',
  TaskExecution = 'TaskExecution',
  TaskView = 'TaskView',
}
