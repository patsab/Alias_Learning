import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CardsService } from 'src/app/services/cards.service';
import { Card } from 'src/app/models/Card';

@Component({
  selector: 'app-card-overview',
  templateUrl: './card-overview.component.html',
  styleUrls: ['./card-overview.component.css']
})
export class CardOverviewComponent implements OnInit {

  cards:Card[];
  tags:string[];


  constructor(private breakpointObserver: BreakpointObserver
    ,private cardService: CardsService
    ,private route: ActivatedRoute
    ,private router: Router) { }

  ngOnInit(): void {
    //get the tags from the url
    this.route.queryParamMap.subscribe(params => this.tags = params.getAll('tags'));

    //get all cards
    this.cardService.getCardsForThema(this.tags).subscribe(res => this.cards = res);
  }

  //this is true if the user device is a smartphone,otherwise it is false
  //this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  navigateEdit(cardId:string){
    this.router.navigate(['/create/card'],{queryParams:{tags:this.tags,cardId:cardId}})
  }
}
