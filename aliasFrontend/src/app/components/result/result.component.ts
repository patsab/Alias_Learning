import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  //the tags are needed for reedirecting the user to the next question
  tags:string[];
  userAnswer:string;
  correctAnswer:string;
  answerId:string;
  hasAnswered:boolean=false;
  selfgivenCorrectness:string;
  bewertung:number;

  constructor(private router:Router
        ,private route:ActivatedRoute
        ,private questionService:QuestionsService) {}

  ngOnInit(): void {
    //get the tags out of the url
    this.route.queryParamMap.subscribe(params => {
      this.tags = params.getAll('tags');
      this.userAnswer = params.get('userAnswer');
      this.correctAnswer = params.get('correctAnswer');
      this.answerId = params.get('answerId');});
  
    //set a flag if the user has answered the question
    //it is possible for a user to enter this side by "antwort anzeigen", where no answer was provided
    if (this.userAnswer){
      this.hasAnswered=true;
    }

  }

  evaluateOwnAnswer():void{
    //if no value for the evaluation is provided, dont insert something
    if (this.bewertung){
      //insert selfgivenCorrectness
      this.questionService.createEvaluuationOwnAnswer(this.answerId,this.bewertung).subscribe();}
    this.nextQuestion();
  }

  nextQuestion():void{
    this.router.navigate(['/question'],{queryParams:{tags:this.tags}});
  }

}
