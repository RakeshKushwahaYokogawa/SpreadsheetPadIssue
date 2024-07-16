import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs'
import { IWorkflowTypes } from 'src/app/eln-web-app-common/models/workflow-type';
import { TemplateTypeStateService } from 'src/app/eln-web-app-common/states/template-type/template-type-state.service';

@Component({
  selector: 'app-template-header[edit]',
  templateUrl: './template-header.component.html',
  styleUrls: ['./template-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateHeaderComponent {
  @Input() form$: Observable<UntypedFormGroup>;
  @Input() showConfigPanelBtn: boolean = true;
  public isEdit: boolean = false;

  @Input('edit') set isEditMode(value: string | boolean) {
    this.isEdit =
      value === true || value == 'true' || value == 'edit' || value === '';
  }

  protected destroy$ = new Subject<void>();
  blockTypes$: Observable<IWorkflowTypes> =
    this.templateTypeStateService.getTemplateTypes();

  constructor(private templateTypeStateService: TemplateTypeStateService,
    private changeDetectorRef: ChangeDetectorRef) { }

  refresh() {
    this.changeDetectorRef.detectChanges();
  }
}
