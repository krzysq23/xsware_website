import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionStore } from './session.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return toObservable(session.initialized).pipe(
    filter(init => init === true),
    take(1),
    map(() => {
      if (session.isAuthenticated()) return true;
      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: router.url },
      });
    }),
  );
};