import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

//import the classes to know about the data structure
import { Filter,Thema } from '../../models/Filter';
import { Statistik } from '../../models/Statistik';

//the Service is imported and injected, so the data can be retrieved from it
import { FilterService } from  '../../services/filter.service'
import { StatistikService } from 'src/app/services/statistik.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  //Data of the class
  filters:Filter[];
  //initialise the statistiks with 0 values
  //it prevents errors if the design is rendered, but the request is not proceses until now
  oneDay:Statistik = {cardsCorrect:0, cardsOverall:0};
  sevenDays:Statistik = {cardsCorrect:0,cardsOverall:0};


  //the service and other stuff is injected, so it can be used inside the class
  constructor(private breakpointObserver: BreakpointObserver
    ,private filterService: FilterService
    ,private statistikService: StatistikService
    ,private router: Router) {}
  
  //ngOnInit is triggered after the component is opened, so basically at the creation of the component
  ngOnInit(){
    //if the user hasn't a valid session, he will be routed to the login page
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login']);
    }

    //get the filters for the user to show these in the frontend
    this.filterService.getFilterfromBackend(sessionStorage.getItem('email'))
        .subscribe(filters => {this.filters=filters});

    //get the statistiks of one day and 7 days
    this.statistikService.getStatisticsfromBackend(sessionStorage.getItem('email'),1)
        .subscribe(res => {this.oneDay=res});
    this.statistikService.getStatisticsfromBackend(sessionStorage.getItem('email'),7)
        .subscribe(res => {this.sevenDays=res});
  }

  //function is used to navigate to the Theme overview
  //it uses the tags of the clicked card ans insert them in the url
  //so the routing looks like this: /thema?tags=Tag1&tags=Tag2
  navigateTo(filter:Filter){
    this.router.navigate(['/thema'],{queryParams:{tags:filter.tags}});
  }

  //this is true if the user device is a smartphone,otherwise it is false
  //this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
}
