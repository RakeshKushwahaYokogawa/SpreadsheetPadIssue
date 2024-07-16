import {
  Component,
  OnInit,
  Input,
  ViewChild,
  forwardRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  BeforeFileOpenArgs,
  DocumentEditorContainerComponent,
  ToolbarService,
} from "@syncfusion/ej2-angular-documenteditor";
import { asyncScheduler } from "rxjs";
import { Constants } from "src/app/eln-web-app-common/app-constants";
import { ToastService } from "src/app/eln-web-app-common/services/toast.service";
@Component({
  selector: "eln-document-editor",
  templateUrl: "./document-editor.component.html",
  styleUrls: ["./document-editor.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ElnDocumentEditorComponent),
      multi: true,
    },
    ToolbarService,
  ],
})
export class ElnDocumentEditorComponent
  implements ControlValueAccessor, OnInit {
  @Input() fileOption: boolean = false;
  @Input() revertOption: boolean = false;
  @Input() attachmentOption: boolean = false;
  @Input() pageStyleOption: boolean = false;
  @Input() searchOption: boolean = false;
  @Input() commentAndTrackOption: boolean = false;
  @Input() documentEditingOption: boolean = false;
  @Input() formOption: boolean = false;
  @Input() showPropertiesPane: boolean = true;
  @ViewChild("documenteditorDefault", { static: true })
  public container: DocumentEditorContainerComponent;

  documentation: string;
  enabled: boolean = true;

  writeValue(value: any) {
    this.documentation = value;
    asyncScheduler.schedule(() => {
      this.openDocumentation();
    });
  }

  onTouched = () => { };
  propagateChange = (_: any) => { };

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }

  public toolbarItems: string[] = [];

  public fileOptionList = ["New", "Open", "|"];
  public revertOptionList = ["Undo", "Redo", "|"];
  public attachmentOptionList = [
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "TableOfContents",
    "|",
  ];
  public pageStyleOptionList = [
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "|",
  ];
  public searchOptionList = ["Find", "|"];
  public commentAndTrackOptionList = ["Comments", "TrackChanges", "|"];
  public documentEditingOptionList = ["LocalClipboard", "|"];
  public formOptionList = ["FormFields", "UpdateFields"];
  public serviceUrl: string = Constants.Wrapper.DocumentEditor.ServiceUrl;
  docOpenDone = false;

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.addFileMenuItems();
  }

  openDocumentation(): void {
    if (this.container && this.container.documentEditor) {
      if (this.documentation && this.documentation != "") {
        this.container.documentEditor.open(this.documentation);
      }
    }
    this.docOpenDone = true;
  }

  contentChange() {
    if (!this.docOpenDone) {
      return;
    }
    this.documentation = this.container.documentEditor.serialize();
    this.onTouched();
    this.propagateChange(this.documentation);
  }

  setDisabledState(isDisabled: boolean) {
    this.enabled = !isDisabled;
  }

  open(fileContents: string) {
    this.container.documentEditor.open(fileContents);
    this.container.documentEditor.isReadOnly = true;
  }

  makeReadOnly(isReadOnly: boolean) {
    this.container.documentEditor.isReadOnly = isReadOnly;
  }

  created() {
    this.container.documentEditor.beforeFileOpen = (fileArguments: BeforeFileOpenArgs) => {
      if (fileArguments.fileSize > Constants.MaximumFileSize) {
        fileArguments.isCanceled = true;
        this.toastService.showError(Constants.FileSizeValidation);
      }
    };
  }

  addFileMenuItems() {
    this.toolbarItems.push(...(this.fileOption ? this.fileOptionList : []));
    this.toolbarItems.push(...(this.revertOption ? this.revertOptionList : []));
    this.toolbarItems.push(
      ...(this.attachmentOption ? this.attachmentOptionList : [])
    );
    this.toolbarItems.push(
      ...(this.pageStyleOption ? this.pageStyleOptionList : [])
    );
    this.toolbarItems.push(...(this.searchOption ? this.searchOptionList : []));
    this.toolbarItems.push(
      ...(this.commentAndTrackOption ? this.commentAndTrackOptionList : [])
    );
    this.toolbarItems.push(
      ...(this.documentEditingOption ? this.documentEditingOptionList : [])
    );
    // Removed form field from document editor
    // this.toolbarItems.push(...(this.formOption ? this.formOptionList : []));
  }

  removeContextMenuItems() {
    this.toolbarItems = []
  }
}