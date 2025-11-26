import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeURLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeUrl | string {
    // Validación de seguridad antes de bypass
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Validar que sea una URL válida (http, https, blob, data para imágenes)
    const urlPattern = /^(https?:\/\/|blob:|data:image\/)/i;

    if (!urlPattern.test(value.trim())) {
      console.warn('SafeURLPipe: URL no válida o potencialmente insegura', value);
      return '';
    }

    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
