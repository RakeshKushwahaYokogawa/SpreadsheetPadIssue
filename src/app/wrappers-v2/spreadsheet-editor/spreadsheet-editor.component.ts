import {
  Component,
  forwardRef,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BeforeOpenEventArgs, SpreadsheetComponent } from "@syncfusion/ej2-angular-spreadsheet";
import { getUniqueID } from "@syncfusion/ej2-base";
import { asyncScheduler } from "rxjs";
import { Constants, DefaultSpreadsheetContentLength, NoImageBase64 } from "src/app/eln-web-app-common/app-constants";
import { ToastService } from "src/app/eln-web-app-common/services/toast.service";

@Component({
  selector: "eln-spreadsheet-editor",
  templateUrl: "./spreadsheet-editor.component.html",
  styleUrls: ["./spreadsheet-editor.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ElnSpreadsheetEditorComponent),
      multi: true,
    },
  ],
})
export class ElnSpreadsheetEditorComponent implements ControlValueAccessor {
  @Input() isProtected: boolean = false;
  @Input() allowOpen: boolean = false;
  @Input() allowSave: boolean = false;
  @Input() spreadsheetName: string;
  @Input() showFormulaBar: boolean = true;
  @Input() showToolBar: boolean = true;
  @Input() isDocumentJsonEdit = false;
  spreadsheet: string;

  @ViewChild("spreadsheetDefault") public container: SpreadsheetComponent;

  enabled: boolean = true;
  saveUrl: string = Constants.Wrapper.SpreadSheetEditor.SaveAsUrl;
  openUrl: string = Constants.Wrapper.SpreadSheetEditor.OpenUrl;
  id: string = getUniqueID();

  writeValue(value: any) {
    if (value !== undefined) {
      this.spreadsheet = value;
      asyncScheduler.schedule(() => {
        this.openSpreadsheet();
        this.updateProtected();
      });
    }
  }

  onTouched = () => { };
  propagateChange = (_: any) => { };

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private toastService: ToastService
  ) {
    asyncScheduler.schedule(() => {
      if (!this.enabled) {
        const addButton: HTMLElement = document.getElementsByClassName('e-add-sheet-tab').item(0) as HTMLElement;
        if (addButton?.style) {
          addButton.style.display = 'none';
        }
      }
    }, 1000)
  }


  openSpreadsheet(): void {
    if (this.container && this.spreadsheet && this.spreadsheet != '') {
      const jsonObject = JSON.parse(this.spreadsheet);
      this.container.openFromJson({ file: jsonObject.jsonObject });
      this.container?.refresh();

      if (!this.enabled) {
        const addButton: HTMLElement = document.getElementsByClassName('e-add-sheet-tab').item(0) as HTMLElement;
        if (addButton?.style) {
          addButton.style.display = 'none';
        }
      }
    }
  }

  contentChange() {
    let updateSpreadsheet = false;
    this.container.saveAsJson().then((json: any) => {
      if (json.jsonObject.Workbook.sheets) {
        json.jsonObject.Workbook.sheets.forEach((sheet: any) => {
          if (sheet && sheet.rows) {
            sheet.rows.forEach((row: any) => {
              if (row && row.cells) {
                row.cells.forEach((cell: { image: any[] }) => {
                  if (cell && cell.image) {
                    cell.image.forEach((image: { src: string, width: number, height: number, top: number }) => {
                      if (image.top) {
                        image.width = Math.trunc(image.width);
                        image.height = Math.trunc(image.height);
                        image.top = Math.trunc(image.top);
                      }
                      if (image.src.includes('https://') || image.src.includes('http://')) {
                        image.src = NoImageBase64;
                        image.width = 40;
                        image.height = 40;
                        updateSpreadsheet = true;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
      if (updateSpreadsheet) {
        asyncScheduler.schedule(() => {
          this.openSpreadsheet();
        })
      }
      const spreadsheetStr = JSON.stringify(json);
      if (spreadsheetStr.length < DefaultSpreadsheetContentLength) {
        this.spreadsheet = spreadsheetStr;
        this.onTouched();
        this.propagateChange(this.spreadsheet);
      } else {
        this.toastService.showError('SpreadsheetJsonError');
        const jsonObject = this.spreadsheet ? JSON.parse(this.spreadsheet) : {};
        if (jsonObject && jsonObject.jsonObject) {
          this.container.openFromJson({ file: jsonObject.jsonObject });
        } else {
          this.container.insertSheet(0);
          this.container.delete(1, json.jsonObject.Workbook.sheets.length);
        }
      }
    });
  }

  removeContextMenuItems() {
    let menus = ['Protect Sheet', 'Hide']
    if (!this.enabled) {
      menus.push('Insert');
    }
    this.container.removeContextMenuItems(menus);
  }

  setDisabledState(isDisabled: boolean) {
    this.enabled = !isDisabled;
    this.updateProtected();
    this.changeDetectorRef.markForCheck();
    if (!this.enabled) {
      const addButton: HTMLElement = document.getElementsByClassName('e-add-sheet-tab').item(0) as HTMLElement;
      if (addButton?.style) {
        addButton.style.display = 'none';
      }
    }
  }

  updateProtected() {
    if (this.container) {
      this.container.sheets.forEach((sheet) => {
        sheet.isProtected = !this.enabled;
      });
    }
  }

  open(file: object) {
    this.container.openFromJson({ file: file });
    if (this.isProtected) {
      this.setDisabledState(true);
    }
  }

  saveSpreadsheet() {
    this.container.endEdit();
    this.contentChange();
  }

  beforeOpen(fileArguments: BeforeOpenEventArgs) {
    if (fileArguments.file && this.#isFile(fileArguments.file) && (fileArguments.file.size > Constants.MaximumFileSize)) {
      fileArguments.cancel = true;
      this.toastService.showError(Constants.FileSizeValidation);
    }
  }

  beforeSave(args: any) {
    args.isFullPost = false;
  }

  #isFile(object: unknown): object is File {
    return !Object.prototype.hasOwnProperty.call(object, 'length')
  }
}
