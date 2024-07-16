import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditComponent } from './pages/edit/edit.component';
import { TemplateHeaderComponent } from './components/template-header/template-header.component';

import { TemplateRoutingModule } from './template-routing.module';
import { ElnWebAppCommonModule } from 'src/app/eln-web-app-common/eln-web-app-common.module';
import { WorkflowBuilderModule } from 'src/app/features/workflow-builder/workflow-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditComponent,
    TemplateHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TemplateRoutingModule,
    ElnWebAppCommonModule,
    WorkflowBuilderModule
  ],
})
export class TemplateModule { }
