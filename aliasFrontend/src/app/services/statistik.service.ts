import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import { Statistik } from '../models/Statistik'

@Injectable({
  providedIn: 'root'
})
export class StatistikService {
  constructor(private http:HttpClient) { }

  //Returns the statistics for user with 1 or 7Days timeperiod
  getStatisticsfromBackend(email:string,days:number=1):Observable<Statistik[]>{
    let queryParam:string = '?days='+ days.toString();
    return this.http
      .get<Statistik[]>('http://localhost:5000/users/'+email+'/progress'+queryParam)
  }
}
