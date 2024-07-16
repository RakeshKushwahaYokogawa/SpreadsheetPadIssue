import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IConfiguration } from '../../models/workflow-config.models';
import { ElnRestApiService } from '../base/eln-rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class WorkflowConfigService {
  constructor(private restAPi: ElnRestApiService) { }

  public getConfiguration(
    forBlockTypeId: string
  ): Observable<IConfiguration[]> {
    return this.restAPi.get<IConfiguration[]>(
      `./assets/data`,
      `workflow-configuration_${forBlockTypeId}.json`
    );
  }
}
