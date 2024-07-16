import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { BlockContainerComponent } from './components/block-container/block-container.component';
import { BlocksComponent } from './components/block/blocks.component';
import { DynamicBlocksDirective } from './directives/dynamic-blocks/dynamic-blocks.directive';
import { ChildIndexPipe } from './pipes/child-index/child-index.pipe';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    DragDropModule, 
    TooltipModule
  ],
  declarations: [
    ChildIndexPipe,
    BlockContainerComponent,
    BlocksComponent,
    DynamicBlocksDirective,
  ],
  exports: [
    ChildIndexPipe,
    BlockContainerComponent,
    BlocksComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkflowBuilderModule { }
