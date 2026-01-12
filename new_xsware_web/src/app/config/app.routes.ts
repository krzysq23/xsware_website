import { Routes } from '@angular/router';
import { AuthGuard } from '@services/auth/authguard.service'; 
import { Home } from '@pages/home/home'; 
import { Contact } from '@pages/contact/contact';
import { About } from '@pages/about/about'; 
import { Login } from '@pages/login/login'; 
import { Portfolio } from '@pages/portfolio/portfolio'; 
import { Profile } from '@pages/profile/profile'; 

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
