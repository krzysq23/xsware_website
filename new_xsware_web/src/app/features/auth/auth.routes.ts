import { Routes } from '@angular/router';
import { redirectIfAuthGuard } from '@app/core/auth/redirect-if-auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [redirectIfAuthGuard],
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [redirectIfAuthGuard],
    loadComponent: () =>
      import('./pages/register/register').then(m => m.RegisterComponent),
  },
];