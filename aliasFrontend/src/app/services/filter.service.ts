import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

//import the necessary classes from the models
//these are used to get or provide the data to the frontend
import { Filter, Thema} from '../models/Filter'

@Injectable({
  providedIn: 'root'
})

export class FilterService {
  constructor(private http:HttpClient) { }

  //standard http option for POST
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  //Return an Observable for the filters of a user
  //if the user doens't have a filter, it will return an empty []
  getFilterfromBackend(email:string):Observable<Filter[]>{
    return this.http
        .get<Filter[]>('http://localhost:5000/users/'+email+'/filters')
        .pipe(map(res =>res['filters']));
  }

  //create POST for a given Thema, which contains the user email and a tagsArray string[]
  addThema(thema:Thema):Observable<Thema>{
    return this.http.post<any>('http://localhost:5000/users/filters',thema);
  }
  
}
