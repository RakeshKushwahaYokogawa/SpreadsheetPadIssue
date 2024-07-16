import { NgModule } from '@angular/core';
import { ElnDocumentEditorComponent } from 'src/app/wrappers-v2/document-editor/document-editor.component';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { ElnSpreadsheetEditorComponent } from 'src/app/wrappers-v2/spreadsheet-editor/spreadsheet-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SpreadsheetAllModule,
    DocumentEditorContainerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ElnSpreadsheetEditorComponent,
    ElnDocumentEditorComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    ElnSpreadsheetEditorComponent,
    ElnDocumentEditorComponent
  ]
})
export class WrapperModule { }
