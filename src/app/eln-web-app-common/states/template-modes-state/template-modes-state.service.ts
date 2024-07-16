import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TemplateService } from '../../http/template/template.service';
import { IWorkflowMode, IWorkflowModes } from '../../models/workflow-modes';
import { BaseStateService } from '../base-state/base-state.service';

const initialSate: IWorkflowModes = {
  modes: [],
};

@Injectable({
  providedIn: 'root',
})
export class TemplateModesStateService
  extends BaseStateService<IWorkflowModes>
  implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private templateService: TemplateService) {
    super(initialSate);
        this.templateService
          .getTemplateModes()
          .pipe(takeUntil(this.destroy$))
          .subscribe((modes: Array<IWorkflowMode>) => {
            this.setState({
              modes: modes,
            });
          });
      // });
  }

  public getState(): IWorkflowModes {
    return this.state;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  public getAvaibleModes(): Observable<IWorkflowMode[]> {
    return this.select((state) => state.modes);
  }
}
