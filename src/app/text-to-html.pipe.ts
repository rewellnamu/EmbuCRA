import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'textToHtml',
  standalone: true
})
export class TextToHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    
    // Convert newlines to <br> tags
    let formatted = value.replace(/\n/g, '<br>');
    
    // Make URLs clickable
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">$1</a>'
    );
    
    return this.sanitizer.sanitize(1, formatted) || '';
  }
}