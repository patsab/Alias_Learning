import { Component, OnInit } from '@angular/core';
import { OidcClientNotification, OidcSecurityService, PublicConfiguration } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'aliasFrontend';
  //isAuthorized:boolean = this.oidcSecurityService.isAuthenticated$;
  //userData:any = this.oidcSecurityService.userData$;

  constructor(public oidcSecurityService: OidcSecurityService){}

    ngOnInit() {
      //this.oidcSecurityService.checkAuth().subscribe(auth => this.isAuthorized = auth);
      
    }

    login() {
      this.oidcSecurityService.authorize();
    }

    logout() {
      this.oidcSecurityService.logoff();
    }

}
