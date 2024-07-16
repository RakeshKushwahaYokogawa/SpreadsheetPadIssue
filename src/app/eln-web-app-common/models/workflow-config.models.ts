export interface IField {
  key: string;
  index: number;
  title: string;
  value?: string;
  selected: boolean;
  disabled: boolean;
  isRepeatable: boolean;
  isNonConfigurable: boolean;
  isCalculated: boolean;
  fieldEditableModes: string[];
}
export interface IConfiguration {
  index: number;
  blockTypeId: string;
  blockGroupId: string;
  blockGroupTitle: string;
  title: string;
  componentKey: string;
  isRequired: boolean;
  isDropped: boolean;
  isDuplicationAllowed: boolean;
  childBlocks: IConfiguration[];
  fields: IField[];
}

export interface IConfigurationGroup {
  blockGroupId: string;
  blockGroupTitle: string;
  componentKey: string;
  childBlocks: IConfiguration[];
}

export interface IWorkflowConfigState {
  rawData: IConfiguration[];
  blockGroup: IConfigurationGroup[];
}