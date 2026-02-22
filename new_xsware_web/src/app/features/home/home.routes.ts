import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ContactComponent } from './pages/contact/contact';
import { AboutComponent } from './pages/about/about';

export const HOME_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
];