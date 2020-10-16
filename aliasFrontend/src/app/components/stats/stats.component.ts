import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AnswerStat } from 'src/app/models/Statistik';
import { StatistikService } from 'src/app/services/statistik.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  tags:string[];
  stats:AnswerStat[];

  constructor(private breakpointObserver: BreakpointObserver
    ,private statService: StatistikService
    ,private route: ActivatedRoute
    ,private router: Router) { }

    ngOnInit(): void {
      //get the tags from the url
      this.route.queryParamMap.subscribe(params => this.tags = params.getAll('tags'));

      //get all cards
      this.statService.getAnswerStats(sessionStorage.getItem('email'),1,this.tags)
        .subscribe(res => this.stats = res)

    }
      // this is true if the user device is a smartphone,otherwise it is false
  // this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
);
  
}
