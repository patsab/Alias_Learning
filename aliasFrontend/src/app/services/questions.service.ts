import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Question } from '../models/Question';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http:HttpClient) { }

  getQuestion(tags:string[]=[]):Observable<Question>{ 
    //make request with params at the end
    //url looks like this: /question?tags=Fach2&tags=Themengebiet
    return this.http
      .get<Question>('http://localhost:5000/question',
          { params:{'tags':tags}})
  }
  
}
