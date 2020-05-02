import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Statistik } from 'src/app/models/Statistik';

import { AppSettings } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class StatistikService {
  constructor(private http:HttpClient) { }

  //Returns the statistics for user with 1 or 7Days timeperiod
  getStatisticsfromBackend(email:string,days:number=1,tags:string[]=[]):Observable<Statistik>{
    //make request with params at the end
    //url looks like this: /users/sabaupa@th-nuernberg.de/progress?days=7&tags=Fach2&tags=Themengebiet
    return this.http
      .get<Statistik>(AppSettings.API_ENDPOINT +'users/'+email+'/progress',
          { params:{'days':days.toString(),'tags':tags}})
  }

}
