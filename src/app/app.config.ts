import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { routes } from './app.routes';

class JsonTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return import(`../assets/i18n/${lang}.json`);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()), // ✅ keep this

    provideTransloco({
      config: {
        availableLangs: ['en', 'sw', 'ki', 'ke'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: JsonTranslocoLoader,
    }),
  ],
};
