import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router:Router
    ,private questionService:QuestionsService) { }

  ngOnInit(): void {
    //get an answer as a result
    this.nextEvaluation()
  }

  //get a new answer for evaluation
  nextEvaluation():void{
    this.questionService.getAnswerforEvaluation().subscribe(result => this.answerForEvaluation = result)
  }

  //post an evaluation and get a new one
  evaluate(points:number):void{
    console.log(this.answerForEvaluation.answerId)
    //create evaluation object
    this.evaluation={
      'answerId':this.answerForEvaluation.answerId,
      'given':points,
      'given_by':sessionStorage.getItem('email'),
    }
    //post the new evaluation
    //after that, get a new evaluation
    this.questionService.createEvaluation(this.evaluation).subscribe(res => this.nextEvaluation)
  }


}
