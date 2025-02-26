import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, format: string = 'medium'): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString(undefined, { dateStyle: format as any });
  }
}
