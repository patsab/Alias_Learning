import { Component, OnInit } from '@angular/core';
import { BreakpointObserver} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit{

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

  //map the current url to a title
  getLocation(url:string):string{
    
    if(url.startsWith('/home')){
      return 'Home'
    }else if (url.startsWith('/create/thema')){
      return 'Neues Thema erstellen'
    }else if (url.startsWith('/create/card')){
      return 'Neue Karte erstellen'
    }else if (url.startsWith('/thema')){
      return 'Themenübersicht'
    }else if (url.startsWith('/question')){
      return 'Lernen'
    }else if (url.startsWith('/result')){
      return 'Ergebnis'
    }else if (url.startsWith('/evaluate')){
      return 'Antworten evaluieren'
    }
    return 'ALIAS'
  }
}
