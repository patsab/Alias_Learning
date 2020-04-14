import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

import { Filter } from '../models/Filter'
@Injectable({
  providedIn: 'root'
})

export class FilterService {
  constructor(private http:HttpClient) { }

  getFilterfromBackend(email:string):Observable<Filter[]>{
    return this.http
        .get<Filter[]>('http://localhost:5000/users/'+email+'/filters')
        .pipe(map(res =>res['filters']));
  }
  
  getTodos(){
    return [
      { title: 'Projektmanagment Meier',tags:['Projektmanagment', 'Meier']},
      { title: 'Neues Thema erstellen',tags:[]},
      { title: 'Andere Antworten evaluieren',tags:[]}
    ]
  }
}
