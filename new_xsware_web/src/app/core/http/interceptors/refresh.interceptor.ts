import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { AuthFacade } from '@app/core/auth/auth.facade';

let refreshPromise: Promise<void> | null = null;

export const refreshInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const auth = inject(AuthFacade);


  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
        return throwError(() => err);
      }

      // Jeśli refresh już trwa, poczekaj na niego
      if (!refreshPromise) {
        refreshPromise = auth.refresh().pipe(
          // zamiana Observable -> Promise<void>
          switchMap(() => from(Promise.resolve())),
          catchError((e) => {
            // refresh nieudany -> logout
            return auth.logout().pipe(
              switchMap(() => throwError(() => err)),
            );
          }),
        ).toPromise().finally(() => {
          refreshPromise = null;
        });
      }

      return from(refreshPromise).pipe(
        switchMap(() => next(req)),
      );
    }),
  );
};