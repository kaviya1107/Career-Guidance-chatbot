import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { RegisterService } from './services/couchdb.service';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(), provideAnimationsAsync(), provideAnimationsAsync(),RegisterService]
};
