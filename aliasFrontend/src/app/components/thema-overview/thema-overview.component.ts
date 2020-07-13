import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Statistik } from '../../models/Statistik';

//the Service is imported and injected, so the data can be retrieved from it
import { StatistikService } from  '../../services/statistik.service'
import { Thema } from 'src/app/models/Filter';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-thema-overview',
  templateUrl: './thema-overview.component.html',
  styleUrls: ['./thema-overview.component.css']
})

export class ThemaOverviewComponent implements OnInit {

  tags:string[];
  //initialise the statistiks with 0 values
  //it prevents errors if the design is rendered, but the request is not proceses until now
  oneDay:Statistik = {cardsCorrect:0, cardsOverall:0,averageCorrectness:0};
  sevenDays:Statistik = {cardsCorrect:0,cardsOverall:0,averageCorrectness:0};

  constructor(private router:Router,
    private route:ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private filterService: FilterService,
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

  //calculates the average of the correct answers
  calculateAverage(correct:number, overall:number) :number{
    return (correct / overall) * 100;
  }

  //Sets the color of the progress bar
  setColor (average: number) : string {
    if(average > 75){ 
      return "#78C000"
    }
    else if(average  >= 40){
      return "#F7CA18"
    }
    else{
      return "#ff0000"
    }
  }

  //this is true if the user device is a smartphone,otherwise it is false
  //this is used for the responsive design
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  //directs the user to answering a question with tags
  jetztLernen(){
    this.router.navigate(['/home/question'],{queryParams:{tags:this.tags}});
  }
  //directs the user to creating a card with predefined tags
  navigateCreateCard(){
    this.router.navigate(['/home/create/card'],{queryParams:{tags:this.tags}})
  }

  //directs the user to the evaluation with the tags
  navigateEvaluation(){
    this.router.navigate(['/home/evaluate'],{queryParams:{tags:this.tags}});
  }

  navigateCardOverview(){
    this.router.navigate(['/home/cards/overview'],{queryParams:{tags:this.tags}});
  }

  navigateHome(){
    this.router.navigate(['/home']);
  }

  deleteThema(){
    let themaToDelete:Thema = {
      email:sessionStorage.getItem("email"),
      filter:this.tags 
    }
    this.filterService.deleteThema(themaToDelete).subscribe(res =>
      this.router.navigate(['/home']));
  }

}
