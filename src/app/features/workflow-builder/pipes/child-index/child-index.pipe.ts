import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'childIndex'
})
export class ChildIndexPipe implements PipeTransform {

  transform(index: number, childIndex: number): string {
    return `${index}.${childIndex}`;
  }

}
