// src/app/pipes/fb-timestamp.pipe.ts
import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'fbTimestamp',
  standalone: true,
  pure: true,
})
export class FbTimestampPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(value: unknown, format: string = 'mediumDate'): string {
    if (value == null) return '';

    let date: Date | null = null;

    if (value instanceof Timestamp) {
      date = value.toDate();
    } else if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'number') {
      date = new Date(value);
    } else if (typeof value === 'string') {
      const parsed = new Date(value);
      date = isNaN(parsed.getTime()) ? null : parsed;
    } else if (typeof (value as any)?.toDate === 'function') {
      // objetos tipo Timestamp-like con .toDate()
      date = (value as any).toDate();
    } else {
      // Sentinel (p. ej. serverTimestamp()) u otro tipo no convertible
      return '';
    }

    return date ? formatDate(date, format, this.locale ?? 'en-US') : '';
  }
}
