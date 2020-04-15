import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

//import the necessary classes from the models
//these are used to get or provide the data to the frontend
import { Filter, Thema} from '../models/Filter'
@Injectable({
  providedIn: 'root'
})

export class FilterService {
  constructor(private http:HttpClient) { }

  //Return an Observable for the filters of a user
  //if the user doens't have a filter, it will return an empty []
  getFilterfromBackend(email:string):Observable<Filter[]>{
    return this.http
        .get<Filter[]>('http://localhost:5000/users/'+email+'/filters')
        .pipe(map(res =>res['filters']));
  }
  
}
