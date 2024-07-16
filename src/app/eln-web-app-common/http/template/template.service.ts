import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITemplateResponse } from '../../models/template.models';
import { IWorkflowMode } from '../../models/workflow-modes';
import { ElnRestApiService } from './../base/eln-rest-api.service';
import { ICreateResponseModel, ISelectListItem } from '../../models/common-model';
import { IWorkflowType } from '../../models/workflow-type';
import { Constants } from '../../app-constants';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  editorTypes: any[] = [
    {
      "key": 1,
      "value": "Text"
    },
    {
      "key": 2,
      "value": "Spreadsheet"
    }
  ];

  constructor(private restAPi: ElnRestApiService) { }

  getBlockTypes(): Observable<Array<ISelectListItem>> {
    return this.restAPi.get<Array<ISelectListItem>>(environment.apiBaseUrls.templateManagement, `WorkflowConfiguration/BlockTypes`);
  }

  public getEditorType(): any[] {
    return this.editorTypes;
  }

  public getTemplateById(templateId: string, withDraft: boolean = false): Observable<ITemplateResponse> {
    return this.restAPi.get<ITemplateResponse>(`./assets/data`, `${templateId}.json`);
  }

  public getTemplateModes(): Observable<Array<IWorkflowMode>> {
    return this.restAPi.get<Array<IWorkflowMode>>(`./assets/data`, `modes.json`);
  }

  public getTemplateTypes(): Observable<Array<IWorkflowType>> {
    return this.restAPi.get<Array<IWorkflowType>>(`./assets/data`, `block-types.json`);
  }

  public create(model: ITemplateResponse): Observable<ICreateResponseModel> {
    return this.restAPi.post<ICreateResponseModel>(environment.apiBaseUrls.templateManagement, 'Template', model);
  }

  public isExist(title: string): Observable<boolean> {
    const encodeValue = decodeURIComponent(title.replace(Constants.rxForMalformed, '%25'));
    return this.restAPi.get<boolean>(environment.apiBaseUrls.templateManagement, `Template/isExist?title=${encodeValue}`);
  }

  public update(model: ITemplateResponse): Observable<ICreateResponseModel> {
    return this.restAPi.put<ICreateResponseModel>(environment.apiBaseUrls.templateManagement, 'Template', model);
  }
}
