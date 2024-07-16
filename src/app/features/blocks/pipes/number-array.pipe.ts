import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberArray'
})
export class NumberArrayPipe implements PipeTransform {

  transform(value: number): Array<number> {
    return Array.from(Array(value).keys());
  }
}
