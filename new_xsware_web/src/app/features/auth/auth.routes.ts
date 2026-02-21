import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  // w przyszłości: register
];