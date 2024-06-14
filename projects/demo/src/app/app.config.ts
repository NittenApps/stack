import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { ApiConfig, NAS_API_CONFIG } from '@na-stack/api';
import { httpErrorInterceptor, loadingInterceptor } from '@na-stack/common';
import { environment } from '../environments/environment';
import { mockBackendInterceptor } from './interceptors/mock-backend.interceptor';
import { routes } from './app.routes';

const API_CONFIG: ApiConfig = {
  baseUrl: environment.apiBaseUrl,
  filesBase: environment.apiBaseUrl,
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NAS_API_CONFIG, useValue: API_CONFIG },
    provideHttpClient(withInterceptors([httpErrorInterceptor, loadingInterceptor, mockBackendInterceptor])),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
