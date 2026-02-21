import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  readonly isBrowser: boolean;
  readonly isServer: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);
  }

  getDocument(): Document | null {
    return this.isBrowser ? document : null;
  }

  getWindow(): Window | null {
    return this.isBrowser ? window : null;
  }
}