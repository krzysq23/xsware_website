import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/authguard.service';
import { ProfileComponent } from './pages/profile/profile';
import { PortfolioComponent } from './pages/portfolio/portfolio';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent, pathMatch: 'full' },
      { path: 'portfolio', component: PortfolioComponent },
    ],
  },
];