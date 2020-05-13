import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router
    ,private oidcSecurityService: OidcSecurityService) {}
  
  logout_simple_session(){
    //set session vars for user to false
    sessionStorage.clear();
  }

  login_simple_session(email:string) {
    email = email.toLowerCase();
    if(email.endsWith('@th-nuernberg.de')){
      //set session vars for user
      sessionStorage.setItem('email',email);
      //redirect the user to overview page
      this.router.navigate(['/home']);
    }
  }
  
  //redirect to the GitLab-LoginPage via the oicd-plugin
  login(){
    this.oidcSecurityService.authorize();
  }

  //if the user is authentificated, redirect him to /home
  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe(auth => {
      if(auth){
        this.router.navigate(['/home'])
      }
    })
  }

}
