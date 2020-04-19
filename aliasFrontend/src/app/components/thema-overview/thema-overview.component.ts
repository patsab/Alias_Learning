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
  //initialise the statistiks with 0 values
  //it prevents errors if the design is rendered, but the request is not proceses until now
  oneDay:Statistik = {cardsCorrect:0, cardsOverall:0};
  sevenDays:Statistik = {cardsCorrect:0,cardsOverall:0};

  constructor(private router:Router,
    private route:ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private statistikService:StatistikService) { }

  ngOnInit(): void {
    
    //get the tags out of the url
    this.route.queryParamMap.subscribe(params => this.tags = params.getAll('tags'));

    //get the statistiks of one day and 7 days
    this.statistikService.getStatisticsfromBackend(sessionStorage.getItem('email'),1,this.tags)
        .subscribe(res => {this.oneDay=res});
    this.statistikService.getStatisticsfromBackend(sessionStorage.getItem('email'),7,this.tags)
        .subscribe(res => {this.sevenDays=res});
  }

  //this is true if the user device is a smartphone,otherwise it is false
  //this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  jetztLernen(){
    this.router.navigate(['/question'],{queryParams:{tags:this.tags}});
  }

  navigateCreateCard(){
    this.router.navigate(['/create/card'],{queryParams:{tags:this.tags}})
  }
}
