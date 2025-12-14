import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getDocument(): Document | null {
    return this.isBrowser ? document : null;
  }

  getWindow(): Window | null {
    return this.isBrowser ? window : null;
  }

  isRunningInBrowser(): boolean {
    return this.isBrowser;
  }
}