import { Dictionary } from '@syncfusion/ej2-angular-documenteditor';

export interface IBlockFormGroupData {
  formData: {
    [key: string]: any;
  };
}

export interface IBlockFormGroup extends IBlockFormGroupData {
  dirty: boolean;
  touched: boolean;
  valid: boolean;
  disabled: boolean;
}

export interface ITempBlock {
  dirty?: boolean
  blockForm: Dictionary<string, IBlockFormGroup>;
}
