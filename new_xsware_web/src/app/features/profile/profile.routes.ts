import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile';
import { PortfolioComponent } from './pages/portfolio/portfolio';
import { EditComponent } from './pages/edit/edit';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', component: ProfileComponent, pathMatch: 'full' },
      { path: 'edit', component: EditComponent},
      { path: 'portfolio', component: PortfolioComponent },
    ],
  },
];