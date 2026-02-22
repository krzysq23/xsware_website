import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@app/features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@app/features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('@app/features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },

  // aliasy:
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  
  // wildcard
  { path: '**', redirectTo: '', pathMatch: 'full' },
];