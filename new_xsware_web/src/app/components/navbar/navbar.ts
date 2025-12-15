import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth/auth.service';
import { UserSessionService } from '../../services/session/userSession.service';

@Component({
    selector: 'app-navbar',
    imports: [ 
      RouterLink,
      NgbCollapseModule
    ],
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.scss']
})
export class Navbar implements OnInit {
    public isCollapsed = true;
    private lastPoppedUrl?: string;
    private yScrollStack: number[] = [];
    public isLoggedIn = false;
    public title = 'XSWare Solution'; 
    public email = 'XSWare Solution';

    constructor(public location: Location, private router: Router, private authService: AuthService, private userSession: UserSessionService) {
        this.authService.isLoggedIn$.subscribe(status => {
            this.isLoggedIn = status;
        });
        this.email = userSession.email();
    }

    ngOnInit() {
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
        if (event instanceof NavigationStart) {
           if (event.url != this.lastPoppedUrl)
               this.yScrollStack.push(window.scrollY);
       } else if (event instanceof NavigationEnd) {
           if (event.url == this.lastPoppedUrl) {
               this.lastPoppedUrl = undefined;
               window.scrollTo(0, this.yScrollStack.pop() ?? 0);
           } else
               window.scrollTo(0, 0);
       }
     });
     this.location.subscribe((ev:PopStateEvent) => {
         this.lastPoppedUrl = ev.url;
     });
    }

    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '#/home' ) {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '#/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    logoutClick(): void {
        this.authService.logout();
    }
}
