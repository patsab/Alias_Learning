import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

//import the classes to know about the data structure
import { Filter,Thema } from '../../models/Filter';

//the Service is imported and injected, so the data can be retrieved from it
import { FilterService } from  '../../services/filter.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  //Data of the class
  filters:Filter[];
  
  //the service and other stuff is injected, so it can be used inside the class
  constructor(private breakpointObserver: BreakpointObserver
    ,private filterService: FilterService
    ,private router: Router) {}
  

  //ngOnInit is triggered after the component is opened, so basically at the creation of the component
  ngOnInit(){
    //if the user hasn't a valid session, he will be routed to the login page
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login'])
    }

    //get the filters for the user to show these in the frontend
    this.filterService.getFilterfromBackend(sessionStorage.getItem('email'))
        .subscribe(filters => {this.filters=filters})
  }


  //this is true if the user device is a smartphone,otherwise it is false
  //this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
}
