import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/authguard.service'; 
import { Home } from '@app/features/home/pages/home/home'; 
import { Contact } from '@app/features/home/pages/contact/contact';
import { About } from '@app/features/home/pages/about/about'; 
import { Login } from '@app/features/auth/pages/login/login'; 
import { Portfolio } from '@app/features/profile/pages/portfolio/portfolio'; 
import { Profile } from '@app/features/profile/pages/profile/profile'; 

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'contact', component: Contact },
    { path: 'about', component: About },
    { path: 'login', component: Login },
    { path: 'portfolio', component: Portfolio },
    { path: 'profile', component: Profile, canActivate: [AuthGuard] },
    // wildcard
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
