import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AppSettings } from "src/app/app.config";
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router
    ,private oauthService: OAuthService) {}
  
  ngOnInit():void{
    this.redirectIfLoggedIn();
    this.oauthService.configure(AppSettings.oauthConfig);
    this.oauthService.initCodeFlow();
    this.oauthService.setupAutomaticSilentRefresh();
  }

  redirectIfLoggedIn(){
    if (sessionStorage.getItem('email')){
      this.router.navigate(['/home'])
    }
  }

  login(){
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }
}
