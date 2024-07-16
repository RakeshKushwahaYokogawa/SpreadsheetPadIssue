import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamicBlock]',
})
export class DynamicBlocksDirective {
  constructor(
    public viewContainerRef: ViewContainerRef
  ) {}
}
