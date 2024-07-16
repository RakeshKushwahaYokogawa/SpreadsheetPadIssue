import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TemplateService } from '../../http/template/template.service';
import { IWorkflowType, IWorkflowTypes } from '../../models/workflow-type';
import { BaseStateService } from '../base-state/base-state.service';

const initialSate: IWorkflowTypes = {
  types: [],
};

@Injectable({
  providedIn: 'root',
})
export class TemplateTypeStateService
  extends BaseStateService<IWorkflowTypes>
  implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private templateService: TemplateService) {
    super(initialSate);
    this.templateService
      .getTemplateTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((types: Array<IWorkflowType>) => {
        this.setState({
          types: types,
        });
      });
  }

  public getState(): IWorkflowTypes {
    return this.state;
  }

  getTemplateTypes(): Observable<IWorkflowTypes> {
    return this.select(state => state);
  }

  public getTypeIdByName(name: string): Observable<string> {
    return this.select((state) => state.types.find(type => type.value.toLocaleLowerCase() == name.toLocaleLowerCase())?.key ?? '');
  }

  public getTemplateTypeIdByName(name: string): string {
    return this.state.types.find(type => type.value.toLocaleLowerCase() == name.toLocaleLowerCase())?.key ?? '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
