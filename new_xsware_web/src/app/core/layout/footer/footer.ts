import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedImports } from '@app/shared/imports';
import { SessionStore } from '@app/core/auth/session.store';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SharedImports],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
  test: Date = new Date();

  private router = inject(Router);
  private session = inject(SessionStore);

  isLoggedIn = computed(() => this.session.isAuthenticated());

  getPath() {
    return this.router.url;
  }
}