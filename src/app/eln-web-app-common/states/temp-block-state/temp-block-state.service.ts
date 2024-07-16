import { Injectable } from '@angular/core';
import { Dictionary } from '@syncfusion/ej2-angular-documenteditor';
import { ITempBlock, IBlockFormGroup } from '../../models/temp-block.model';
import { BaseStateService } from '../base-state/base-state.service';

const initialState: ITempBlock = {
  blockForm: new Dictionary<string, IBlockFormGroup>(),
};

@Injectable({
  providedIn: 'root',
})
export class TempBlockStateService extends BaseStateService<ITempBlock> {
  constructor() {
    super(initialState);
  }

  public getTempBlockState() {
    return this.select((state) => state.blockForm);
  }

  public getTempBlockFieldValue(blockId: string, fieldKey: string) {
    return this.select((state) => {
      const formData = state.blockForm.get(blockId);
      return formData && formData.formData[fieldKey];
    });
  }

  public reset() {
    this.setState({ ...initialState });
  }

  public addOrUpdateTempBlockState(
    blockId: string,
    blockFormGroup: IBlockFormGroup
  ) {
    const tempBlockData: Dictionary<string, IBlockFormGroup> = new Dictionary<
      string,
      IBlockFormGroup
    >();
    this.state.blockForm.keys.forEach((id) => {
      tempBlockData.add(id, this.state.blockForm.get(id));
    });
    if (tempBlockData.containsKey(blockId)) {
      tempBlockData.set(blockId, blockFormGroup);
    } else {
      tempBlockData.add(blockId, blockFormGroup);
    }
    this.setState({ blockForm: tempBlockData });
  }

  public removeBlock(blockId: string) {
    if (this.state.blockForm.keys.includes(blockId)) {
      this.state.blockForm.remove(blockId);
    }
  }

  public markAsDirty() {
    this.setState({ ...this.state, dirty: true });
  }

  public getState() {
    return this.state;
  }
}
