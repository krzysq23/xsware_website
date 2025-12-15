import { Component, Inject, Renderer2} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth/auth.service';

import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Location } from "@angular/common";
import { DOCUMENT } from "@angular/common";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    Navbar, 
    Footer, 
    CommonModule,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    public location: Location,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      console.log(this.document.title);
    } else {
      console.log('SSR: No document object available');
    }
  }
  title = 'XSWare Solution';
  
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.authService.checkAuth();
  }
}
