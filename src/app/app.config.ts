import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, tokenInterceptor])),
    importProvidersFrom(SharedModule, CoreModule)
  ]
};
