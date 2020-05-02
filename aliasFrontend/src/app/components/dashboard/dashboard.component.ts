import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// import the classes to know about the data structure
import { Filter, FilterWithStatistiks } from 'src/app/models/Filter';
import { Statistik } from 'src/app/models/Statistik';

// the Service is imported and injected, so the data can be retrieved from it
import { FilterService } from 'src/app/services/filter.service';
import { StatistikService } from 'src/app/services/statistik.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  filters: FilterWithStatistiks[];


  // the service and other stuff is injected, so it can be used inside the class
  constructor(private breakpointObserver: BreakpointObserver
    ,private filterService: FilterService
    ,private router: Router) {
    }
  
  // ngOnInit is triggered after the component is opened, so basically at the creation of the component
  ngOnInit(){
    // get the filters for the user with progress
    this.filterService.getFilterwithStats(sessionStorage.getItem('email'))
        .subscribe(result => {this.filters = result; });
  
  }

  // function is used to navigate to the Theme overview
  // it uses the tags of the clicked card ans insert them in the url
  // so the routing looks like this: /thema?tags=Tag1&tags=Tag2
  navigateTo(filter:Filter){
    this.router.navigate(['/thema'],{queryParams:{tags:filter.tags}});
  }

  // this is true if the user device is a smartphone,otherwise it is false
  // this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
}
