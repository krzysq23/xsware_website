import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbDropdownItem
} from '@ng-bootstrap/ng-bootstrap';

export const SharedImports = [
  // common
  NgClass,

  // router
  RouterLink,
  RouterLinkActive,
  RouterOutlet,

  // ng-bootstrap
  NgbCollapse,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbDropdownItem,
] as const;