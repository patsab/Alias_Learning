import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Statistik } from '../../models/Statistik';

//the Service is imported and injected, so the data can be retrieved from it
import { StatistikService } from  '../../services/statistik.service'

@Component({
  selector: 'app-thema-overview',
  templateUrl: './thema-overview.component.html',
  styleUrls: ['./thema-overview.component.css']
})

export class ThemaOverviewComponent implements OnInit {

  tags:string[];
  oneDay:Statistik[];
  sevenDays:Statistik[];

  constructor(private router:Router,
    private route:ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private statistikService:StatistikService) { }

  ngOnInit(): void {
    //if the user hasn't a valid session, he will be routed to the login page
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login'])
    }
    
    //get the tags out of the url
    this.route.queryParamMap.subscribe(params => this.tags = params.getAll('tags'));

    //TODO - not working
    //get the statistiks of one day and 7 days
    this.statistikService.getStatisticsfromBackend(sessionStorage.getItem('email'),1)
        .subscribe(res =>{this.oneDay=res});
    this.statistikService.getStatisticsfromBackend(sessionStorage.getItem('email'),7)
        .subscribe(res =>{this.sevenDays=res});

    console.log(this.oneDay)
    console.log(this.sevenDays)
  }

  //this is true if the user device is a smartphone,otherwise it is false
  //this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  

}
