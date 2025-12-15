import { Component, OnInit, Inject, Renderer2, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth/auth.service';

import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Location } from "@angular/common";
import { DOCUMENT } from "@angular/common";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { filter, Subscription } from 'rxjs';

var  lastScrollTop = 0;
var  delta = 5;
var  navbarHeight = 0;

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
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router,
    public location: Location,
    private element : ElementRef,
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
  private routerSub?: Subscription;

  @HostListener('window:scroll')
  hasScrolled() {

      var st = window.pageYOffset;
      if(Math.abs(lastScrollTop - st) <= delta)
          return;

      var navbar = document.getElementsByTagName('nav')[0];
      const number = window.scrollY;

      if (st > lastScrollTop && st > navbarHeight){
          if (navbar.classList.contains('headroom--pinned')) {
              navbar.classList.remove('headroom--pinned');
              navbar.classList.add('headroom--unpinned');
          }
      } else {
          if(st + window.innerHeight < document.body.scrollHeight) {
              if (navbar.classList.contains('headroom--unpinned')) {
                  navbar.classList.remove('headroom--unpinned');
                  navbar.classList.add('headroom--pinned');
              }
          }
      }
      if (number > 150 || window.pageYOffset > 150) {
          navbar.classList.add('headroom--not-top');
      } else {
          navbar.classList.remove('headroom--not-top');
      }

      lastScrollTop = st;
  };

  ngOnInit() {
    var navbar : HTMLElement = this.element.nativeElement.children[0].children[0];2
    this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        if (window.outerWidth > 991) {
            window.document.children[0].scrollTop = 0;
        }else{
            if (window.document.activeElement) {
                (window.document.activeElement as HTMLElement).scrollTop = 0;
            }
        }
    });
    this.hasScrolled();

    /* Check authentication only in the browser */
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.authService.checkAuth();
  }
}
