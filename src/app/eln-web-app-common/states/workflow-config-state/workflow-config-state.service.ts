import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, takeUntil, Subscription } from 'rxjs';
import {
  IConfiguration,
  IConfigurationGroup,
  IWorkflowConfigState,
} from '../../models/workflow-config.models';
import { BaseStateService } from '../base-state/base-state.service';
import { TemplateStateService } from '../template-state/template-state.service';
import { ITemplateBlock, ITemplateResponse } from '../../models/template.models';
import { WorkflowConfigService } from '../../http/workflow-config/workflow-config.service';
import { TemplateTypeStateService } from '../template-type/template-type-state.service';
import { Constants } from '../../app-constants';

const initialSate: IWorkflowConfigState = {
  rawData: [],
  blockGroup: [],
};

@Injectable({
  providedIn: 'root',
})
export class WorkflowConfigStateService
  extends BaseStateService<IWorkflowConfigState>
  implements OnDestroy {
  private destroy$ = new Subject<void>();
  workflowConfigSubscription: Subscription;

  private workflowConfigData$: Observable<IConfiguration[]> = this.select(
    (state) => state.rawData
  );

  private workflowConfigGroupData$: Observable<IConfigurationGroup[]> =
    this.select((state) => state.blockGroup);

  constructor(
    private templateState: TemplateStateService,
    private templateTypeState: TemplateTypeStateService,
    private workflowConfigService: WorkflowConfigService,
  ) {
    super(initialSate);
    this.templateState
      .getTemplateData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((templateData: ITemplateResponse) => {
        if (!templateData.blockTypeId) return;
        if (this.workflowConfigSubscription) {
          this.workflowConfigSubscription.unsubscribe()
        }
        this.workflowConfigSubscription = this.workflowConfigService
          .getConfiguration(templateData.blockTypeId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((configData) => {
            if (templateData.blocks.length == 0) {
              const taskType = this.templateTypeState.getState().types.find(type => type.key == templateData.blockTypeId);
              const requiredBlockForType = [...taskType?.requiredBlocks ?? []];
              if (templateData.newTemplate) {
                switch (taskType?.value) {
                  case Constants.TaskType.Documentation:
                    requiredBlockForType.push(
                      Constants.WorkflowLibrary.DocumentationBlock.ComponentTitle
                    );
                    break;
                }
              }
              const requiredBlocks = configData.filter(block => block.isRequired || requiredBlockForType?.includes(block.componentKey));
              templateData.blocks = requiredBlocks.map((block, index) => {
                const title = "WorkflowConfiguration." + block.componentKey + "." + block.title + "." + block.componentKey;
                return {
                  ...block, id: (new Date().getTime() + index).toString(),
                  title: title,
                  childBlocks: [],
                  childBlockOptions: Object.assign(block.childBlocks),
                  fields: block.fields ? block.fields.map(field => {
                    return { ...field };
                  }) : []
                } as ITemplateBlock
              });
              templateState.updateTemplateBlocks(templateData.blocks);
            } else {
              templateData.blocks.forEach(block => {
                const configBlock = configData.find(cBlock => cBlock.componentKey == block.componentKey);
                block.childBlockOptions = configBlock?.childBlocks;
              });
            }

            this.updateIsDropped(templateData, configData);
          });
      });
  }

  public updateIsDroppedFromState(templateData: ITemplateResponse,) {
    const configData = this.state.rawData;
    this.updateIsDropped(templateData, configData);

  }

  public updateIsDropped(templateData: ITemplateResponse, configData: IConfiguration[]) {
    if (templateData && configData.length > 0) {
      configData.forEach(wfItem => {
        if (templateData.blocks.some(block => block.componentKey == wfItem.componentKey)) {
          wfItem.isDropped = true;
        }
      });
      this.setState({
        rawData: configData,
        blockGroup: this.getConfigBlocksByGroup(configData),
      });
    }
  }

  public getWorkflowConfigRawData(): Observable<IConfiguration[]> {
    return this.workflowConfigData$;
  }
  public getWorkflowConfigGroupData(): Observable<IConfigurationGroup[]> {
    return this.workflowConfigGroupData$;
  }

  public getCurrentWorkflowConfigData(): IConfiguration[] {
    return this.state.rawData;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  public getState(): IWorkflowConfigState {
    return this.state;
  }

  private getConfigBlocksByGroup(
    configData: IConfiguration[]
  ): IConfigurationGroup[] {
    const uniqueBlockGroupID = [
      ...new Set(configData.map((item) => item.blockGroupId)),
    ];
    const ub: IConfigurationGroup[] = uniqueBlockGroupID.map((blockGroupID) => {
      const filterData = configData.filter(
        (config) => config.blockGroupId == blockGroupID
      );
      const block: IConfigurationGroup = {
        blockGroupId: blockGroupID,
        blockGroupTitle: filterData[0].blockGroupTitle,
        componentKey: filterData[0].componentKey,
        childBlocks: filterData,
      };
      return block;
    });
    return ub;
  }

  getBlockByComponentName(blockComponentName: string) {
    return this.state.rawData.find(x => x.componentKey == blockComponentName)
  }
}
