import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '@app/core/auth/session.store';
import { AUTH_PUBLIC_PATHS } from '@app/core/auth/auth.public-paths';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const token = session.accessToken();

  const isPublic = AUTH_PUBLIC_PATHS.some(path =>
    req.url.includes(path)
  );

  if (isPublic) {
    return next(req);
  }

  if (!token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};