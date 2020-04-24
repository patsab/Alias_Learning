import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';

//import the necessary classes from the models
//these are used to get or provide the data to the frontend
import { Filter, Thema, FilterWithStatistiks} from 'src/app/models/Filter'
import { StatistikService } from './statistik.service';
import { Statistik } from '../models/Statistik';

@Injectable({
  providedIn: 'root'
})

export class FilterService {
  constructor(private http:HttpClient,
    private statistikService: StatistikService) { }

  //Return an Observable for the filters of a user
  //if the user doens't have a filter, it will return an empty []
  getFilterfromBackend(email:string):Observable<Filter[]>{
    return this.http
        .get<Filter[]>('http://localhost:5000/users/'+email+'/filters')
        .pipe(map(res =>res['filters']));
  }

  getFilterwithStats(email:string):Observable<FilterWithStatistiks[]>{
    return this.http
        .get<FilterWithStatistiks[]>('http://localhost:5000/users/'+email+'/filterProgress');
  }

  //create POST for a given Thema, which contains the user email and a tagsArray string[]
  addThema(thema:Thema):Observable<Thema>{
    return this.http.post<any>('http://localhost:5000/users/filters',thema);
  }
  
}
