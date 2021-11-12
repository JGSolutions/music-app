import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinList',
  pure: true
})
export class JoinListPipe implements PipeTransform {

  transform(input:Array<any>, property: string, sep = ','): any {
    const data = input.map(d => d[property]);
    return data.join(sep);
  }

}
