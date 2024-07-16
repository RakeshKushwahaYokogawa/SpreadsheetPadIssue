import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { WorkflowModes } from 'src/app/eln-web-app-common/models/dynamic-block';
import { RedoUndoService } from 'src/app/eln-web-app-common/redo-undo/redo-undo.service';
import { TempBlockStateService } from 'src/app/eln-web-app-common/states/temp-block-state/temp-block-state.service';
import { TemplateModesStateService } from 'src/app/eln-web-app-common/states/template-modes-state/template-modes-state.service';
import { TemplateStateService } from 'src/app/eln-web-app-common/states/template-state/template-state.service';
import { BlockBaseComponent } from '../base/block-base.component';

@Component({
  selector: 'app-dummy-block',
  templateUrl: './dummy-block.component.html',
  styleUrls: ['./dummy-block.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockComponent extends BlockBaseComponent {
  ngOnInit(): void {
    this.onInit();
  }
  ngOnDestroy(): void {
    this.onDestroy();
  }
  @Input() blockID: string;
  @Input() childBlockId: string;
  @Input() workflowMode: WorkflowModes;

  workflowBlockData$ = this._workflowBlockData$;

  form: UntypedFormGroup;
  constructor(
    templateStateService: TemplateStateService,
    templateModesStateService: TemplateModesStateService,
    tempBlockStateService: TempBlockStateService,
    redoUndoService: RedoUndoService
  ) {
    super(
      templateStateService,
      templateModesStateService,
      tempBlockStateService,
      redoUndoService
    );
  }
}
