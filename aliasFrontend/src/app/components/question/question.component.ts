import { Component, OnInit } from '@angular/core';

import { Question, Answer } from '../../models/Question';
import { QuestionsService } from '../../services/questions.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  tags:string[];
  //initialise the question with empty attributes
  //it prevents errors if the design is rendered, but the request is not proceses until now
  question:Question = {cardId:"",question:"",answer:""};
  answer:Answer;
  predictedCorrectness:number;

  constructor(private router: Router
    ,private route:ActivatedRoute
    ,private questionService: QuestionsService) { }

  ngOnInit(): void {
    //if the user hasn't a valid session, he will be routed to the login page
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login'])
    }

    //get the tags out of the url
    this.route.queryParamMap.subscribe(params => this.tags = params.getAll('tags'));

    //get a question
    this.questionService.getQuestion(this.tags).subscribe(question => this.question = question);
  }

  //skip the question and load a new one
  nextQuestion(){
    //get a question
    //TODO test this, when multiple questions are in the DB
    //TODO this just loads a new question, maybe just a quick animation for the loading
    //TODO if just 1 question matches the tags, the user should see this in someway, maybe through the reload animation explaind in the TODO above
    this.questionService.getQuestion(this.tags).subscribe(question => this.question = question);
  }

  //insert the answer in the DB and route the user to the Result Page
  createAnswer(userAnswer:string):void{
    //when the userInput is empty, do nothing
    if (userAnswer==""){
      return;
    }
    //create the answer data type
    this.answer={email:sessionStorage.getItem('email')
            ,userAnswer:userAnswer
            ,correctAnswer:this.question.answer
            ,cardId:this.question.cardId
            ,question:this.question.question};

    //after the POST returns a result, redirect to result page
    this.questionService.createAnswer(this.answer).subscribe(result =>
          {this.router.navigate(['/result'],{queryParams:{tags:this.tags,predictedCorrectness:result}})});
  }

  //Navigate to the result page but with the query param correctAnswer
  showAnswer(){
    this.router.navigate(['/result'],{queryParams:{tags:this.tags,correctAnswer:this.question.answer}});
  }


}
