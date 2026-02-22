import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_BASE_URL } from './http.tokens';
import { environment } from '@environments/environments';


import { authInterceptor } from './interceptors/auth.interceptor';
import { refreshInterceptor } from './interceptors/refresh.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const provideXswareHttp = () => [
  { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  provideHttpClient(
    withInterceptors([errorInterceptor, refreshInterceptor, authInterceptor]),
  ),
];