import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { MaterialModule } from './shared/material.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(MaterialModule)
  ]
};
