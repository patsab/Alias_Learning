import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AnswerForEvaluation, Evaluation } from '../../models/Question';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-evaluate-answers',
  templateUrl: './evaluate-answers.component.html',
  styleUrls: ['./evaluate-answers.component.css']
})
export class EvaluateAnswersComponent implements OnInit {

  answerForEvaluation:AnswerForEvaluation={question:"",answerId:"",correctAnswer:"",userAnswer:""};
  evaluation:Evaluation;
  tags:string[]=[]

  constructor(private router:Router
    ,private questionService:QuestionsService
    ,private route:ActivatedRoute) { }

  ngOnInit(): void {
    //get an answer as a result
    this.route.queryParamMap.subscribe(params => 
      {this.tags = params.getAll('tags');
      this.nextEvaluation()});
  }

  //get a new answer for evaluation
  nextEvaluation():void{
    if (this.tags==[]){
      this.questionService.getAnswerforEvaluation().subscribe(result => {this.answerForEvaluation = result;});
    }else{
      this.questionService.getAnswerforEvaluation(this.tags).subscribe(result => {this.answerForEvaluation = result;});
    }
  }

  //post an evaluation and get a new one
  evaluate(points:number):void{
    if (!points){
      return this.nextEvaluation()
    }
    //create evaluation object
    this.evaluation={
      'answerId':this.answerForEvaluation.answerId,
      'given':points,
      'given_by':sessionStorage.getItem('email'),
    }
    //post the new evaluation
    //after that, get a new evaluation
    this.questionService.createEvaluation(this.evaluation).subscribe(res => this.nextEvaluation())
  }


}
