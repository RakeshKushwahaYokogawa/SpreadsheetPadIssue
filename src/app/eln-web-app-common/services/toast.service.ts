import { Injectable } from '@angular/core';
import { Toast, ToastUtility } from '@syncfusion/ej2-angular-notifications';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toastObj: Toast;
  constructor() { }

  showError(msg: string) {
    this.toastObj = ToastUtility.show({
      content: msg,
      timeOut: 5000,
      position: { X: 'center' },
      cssClass: 'e-toast-error',
    }, 'error');
  }

  showSuccess(msg: string) {
    this.toastObj = ToastUtility.show({
      content: msg,
      timeOut: 5000,
      position: { X: 'center' },
      cssClass: 'e-toast-success',
    }, 'success');
  }

  showInfo(title: string, msg: string) {
    this.toastObj = ToastUtility.show({
      title: title,
      content: msg,
      timeOut: 5000,
      showCloseButton: true,
      position: { X: 'center' },
      cssClass: 'e-toast-info toast-text',
    }, 'Information');
  }
}
