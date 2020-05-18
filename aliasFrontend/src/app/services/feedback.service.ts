import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Feedback } from 'src/app/models/Feedback';
import { AppSettings } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http:HttpClient) {}

    //Add Feedback in the DB
    addFeedback(feedback:Feedback):Observable<Feedback>{
      return this.http.post<any>(AppSettings.API_ENDPOINT +'feedback',feedback);
    }
}
