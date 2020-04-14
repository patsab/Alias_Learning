import { Component, OnInit } from '@angular/core';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Filter } from '../../models/Filter';

import { FilterService } from  '../../services/filter.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  filters:Filter[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
  
  constructor(private breakpointObserver: BreakpointObserver
    ,private filterService: FilterService
    ,private router: Router) {}
    
  ngOnInit(){
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login'])
    }

    this.filterService.getFilterfromBackend(sessionStorage.getItem('email'))
        .subscribe(filters => {this.filters=filters})
  }

}
