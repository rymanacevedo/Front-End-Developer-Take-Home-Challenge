import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimestamp',
  standalone: true,
})
export class FormatTimestampPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      return '';
    }

    const date = new Date(value * 1000);
    const pad = (num: number) => (num < 10 ? '0' + num : num);

    return (
      `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
  }
}
