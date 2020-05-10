import { Component, OnInit } from '@angular/core';
import { BreakpointObserver} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MAT_DRAWER_CONTAINER } from '@angular/material/sidenav/drawer';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit{

  opened: Boolean;
  location:string="ALIAS";

  constructor(private breakpointObserver: BreakpointObserver
    ,private route:ActivatedRoute
    ,private router:Router) {}

  ngOnInit(){
    //if the user hasn't a valid session, he will be routed to the login page
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login'])
    }
    //set the heading in the main nav to the current location/function
    this.location = this.getLocation(this.route.snapshot['_routerState'].url);
  }

  //load a new component and change the Location String in the nav-bar
  loadnewPage(page:string){
    this.router.navigate([page])
    this.location = this.getLocation(page);
    this.opened = false;
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
    }else if (url.startsWith('/home')){
      return 'Home'
    }

    return 'ALIAS'
  }
}
