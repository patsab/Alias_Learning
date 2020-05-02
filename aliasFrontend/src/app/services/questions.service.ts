import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Question, Answer, Evaluation, AnswerForEvaluation } from '../models/Question';

import { AppSettings } from 'src/app/app.config';


@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http:HttpClient) { }

  getQuestion(tags:string[]=[]):Observable<Question>{ 
    //make request with params at the end
    //url looks like this: /question?tags=Fach2&tags=Themengebiet
    return this.http
      .get<Question>(AppSettings.API_ENDPOINT +'question',
          { params:{'tags':tags}})
  }
  
  //POST an answer and return the predictedCorrectness 
  createAnswer(answer:Answer):Observable<number>{
    return this.http
    .post<any>(AppSettings.API_ENDPOINT +'answer',answer);
  }

  //Return an Answer to evaluate
  getAnswerforEvaluation():Observable<AnswerForEvaluation>{
    return this.http
     .get<AnswerForEvaluation>(AppSettings.API_ENDPOINT +'answer/validate/'+sessionStorage.getItem('email'))
  }

  //POST an Evaluation
  createEvaluation(evaluation:Evaluation):Observable<Evaluation>{
    return this.http
      .post<any>(AppSettings.API_ENDPOINT +'answer/validate',evaluation)
  }

  //Post the selfgivenCorrectness for an answer
  createEvaluuationOwnAnswer(answerId:string,evaluation:number):Observable<any>{
    return this.http
      .post<any>(AppSettings.API_ENDPOINT +'answer/self',{'answerId':answerId,'selfgivenCorrectness':evaluation})
  }

}
