import { Component, OnInit } from '@angular/core';
import { BreakpointObserver} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MAT_DRAWER_CONTAINER } from '@angular/material/sidenav/drawer';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppSettings } from 'src/app/app.config';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit{

  isAuthorized:boolean;
  opened: Boolean;
  location:string="ALIAS";

  constructor(private breakpointObserver: BreakpointObserver
    ,private route:ActivatedRoute
    ,private router:Router
    ,private oauthService:OAuthService
    ,private _location:Location) {}

  ngOnInit(){
    //set the heading in the main nav to the current location/function
    this.location = this.getLocation(this.route.snapshot['_routerState'].url);
    //if the route contains ?code=... then do the login process
    this.route.queryParamMap.subscribe(params =>
      {if(params.get('code')){
        this.oauthService.configure(AppSettings.oauthConfig);
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadDiscoveryDocumentAndLogin();
        // get the user data after the token is received
        // the request of the data is handles by loadUserProfile()
        this.oauthService.events
          .pipe(filter(e => e.type === 'token_received'))
          .subscribe(async _ =>{
          sessionStorage.setItem('email',await this.oauthService.loadUserProfile().then(result => result.email));
          //after setting the email, reload the page, so the data from the backend is with the correct email
          window.location.reload();
        });
      }
      //if the user doesn't arrive with code, check if he is logged in 
      else{
        this.redirectIfNotAuth();
      }})
  }

  //load a new component and change the Location String in the nav-bar
  loadnewPage(page:string){
    this.redirectIfNotAuth();
    this.router.navigate([page])
    this.opened = false;
  }

  //logoff and redirect to login page
  userLogOff(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  //if the user is not authorized, he will be redirected to login page and loggedOff
  redirectIfNotAuth(){
    console.log(sessionStorage.getItem('email'));
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login']);
    }   
  }

  //map the current url to a title
  getLocation(url:string):string{
    if(url.startsWith('/home/cards')){
      return 'Karten'
    }else if (url.startsWith('/home/create/thema')){
      return 'Neues Thema erstellen'
    }else if (url.startsWith('/home/create/card')){
      return 'Neue Karte erstellen'
    }else if (url.startsWith('/home/thema')){
      return 'Themenübersicht'
    }else if (url.startsWith('/home/question')){
      return 'Lernen'
    }else if (url.startsWith('/home/result')){
      return 'Ergebnis'
    }else if (url.startsWith('/home/evaluate')){
      return 'Antworten evaluieren'
    }else if (url.startsWith('/home/feedback')){
      return 'Feedback'
    }else if (url.startsWith('/home')){
      return 'Home'
    }

    return 'ALIAS'
  }

  changeOfRoutes(){
    //this.redirectIfNotAuth();
    this.location = this.getLocation(this.route.snapshot['_routerState'].url);
  }
  
  navigateBack(){
    this._location.back();
  }
}
