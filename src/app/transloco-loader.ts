import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(path: string): Observable<Translation> {
    // Transloco calls this method with different path formats:
    // - "en" -> root language file (we return empty since we use scoped translations only)
    // - "header/en" -> scoped translation for header component
    // - "home/en" -> scoped translation for home component
    
    // Check if it's a scoped translation (contains '/')
    if (path.includes('/')) {
      // Split "header/en" into ["header", "en"]
      const [scope, lang] = path.split('/');
      // Transform to our file structure: /i18n/en/header.json
      return this.http.get<Translation>(`/i18n/${lang}/${scope}.json`);
    }
    
    // For root language requests (just "en", "sw", etc.), return empty object
    // since we only use scoped translations in our app
    return of({});
  }
}