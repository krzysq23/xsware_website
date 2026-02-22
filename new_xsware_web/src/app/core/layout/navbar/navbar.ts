import { Component, OnInit, DestroyRef, computed, inject } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { PlatformService } from '@app/core/platform/platform.service';
import { Location, PopStateEvent } from '@angular/common';
import { SharedImports } from '@app/shared/imports';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthFacade } from '@app/core/auth/auth.facade';
import { SessionStore } from '@app/core/auth/session.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedImports],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit {
  public isCollapsed = true;
  private lastPoppedUrl?: string;
  private yScrollStack: number[] = [];

  public title = 'XSWare Solution';

  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private location = inject(Location);
  private platform = inject(PlatformService);

  private auth = inject(AuthFacade);
  private session = inject(SessionStore);

  isLoggedIn = computed(() => this.session.isAuthenticated());

  email = computed(() => (this.isLoggedIn() ? 'Zalogowany użytkownik' : 'Gość'));

  ngOnInit() {
    if (!this.platform.isBrowser) return;

    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.isCollapsed = true;

        if (event instanceof NavigationStart) {
          if (event.url !== this.lastPoppedUrl) this.yScrollStack.push(window.scrollY);
        } else if (event instanceof NavigationEnd) {
          if (event.url === this.lastPoppedUrl) {
            this.lastPoppedUrl = undefined;
            window.scrollTo(0, this.yScrollStack.pop() ?? 0);
          } else {
            window.scrollTo(0, 0);
          }
        }
      });

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url ?? undefined;
    });
  }

  isHome() {
    const url = this.location.prepareExternalUrl(this.location.path());
    return url === '#/home' || url === '#/' || url === '' || url === '/';
  }

  isDocumentation() {
    const url = this.location.prepareExternalUrl(this.location.path());
    return url === '#/documentation';
  }

  logoutClick(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => this.router.navigateByUrl('/'),
    });
  }
}