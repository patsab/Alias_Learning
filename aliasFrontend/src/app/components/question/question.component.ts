import { Component, OnInit } from '@angular/core';

import { Question } from '../../models/Question';
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

}
