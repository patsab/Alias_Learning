import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AppSettings } from "src/app/app.config";
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router
    ,private oauthService: OAuthService
    ,private route:ActivatedRoute) {}
  
  ngOnInit():void{
    this.redirectIfLoggedIn();
    this.oauthService.configure(AppSettings.oauthConfig);
    this.route.queryParamMap.subscribe(params =>
      {if(params.get('code')){
        this.oauthService.loadDiscoveryDocumentAndLogin();
        // get the user data after the token is received
        // the request of the data is handles by loadUserProfile()
        this.oauthService.events
          .pipe(filter(e => e.type === 'token_received'))
          .subscribe(async _ =>{
          sessionStorage.setItem('email',await this.oauthService.loadUserProfile().then(result => result.email));
          //after setting the email, reload the page, so the data from the backend is with the correct email
          this.redirectIfLoggedIn();
        });
      }
      //if the user doesn't arrive with code, check if he is logged in 
      else{
        this.redirectIfLoggedIn();
      }})
  }

  redirectIfLoggedIn(){
    if (sessionStorage.getItem('email')){
      this.router.navigate(['/home'])
    }
  }

  login(){
    this.oauthService.initCodeFlow();
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }
}
