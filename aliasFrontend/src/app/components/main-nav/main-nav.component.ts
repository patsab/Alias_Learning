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
    ,private oauthService:OAuthService) {}

  ngOnInit(){
    //set the heading in the main nav to the current location/function
    this.location = this.getLocation(this.route.snapshot['_routerState'].url);
    //if the route contains ?code=... then do the login process
    this.redirectIfNotAuth();
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
    }else if (url.startsWith('/home/howto')){
      return 'How To'
    }else if (url.startsWith('/home/stats')){
       return 'Statistik heute'
    }else if (url.startsWith('/home')){
      return 'Home'
    }

    return 'ALIAS'
  }

  changeOfRoutes(){
    this.redirectIfNotAuth();
    this.location = this.getLocation(this.route.snapshot['_routerState'].url);
  }
  
  navigateBack(){
    this.router.navigate(['/home']);
  }


}
