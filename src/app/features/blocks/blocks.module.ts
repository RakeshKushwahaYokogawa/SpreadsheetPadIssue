import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockComponent as DummyBlockComponent } from './components/dummy-block/dummy-block.component';
import { BlockComponent as DocumentationBlockComponent } from './components/documentation-block/documentation-block.component';
import { WorkflowBuilderModule } from '../workflow-builder/workflow-builder.module';
import { WrapperModule } from 'src/app/wrappers-v2/wrapper.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkflowBuilderModule,
    WrapperModule
  ],
  declarations: [
    DummyBlockComponent,
    DocumentationBlockComponent,
  ]
})
export class BlocksModule { }
