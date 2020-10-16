import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../models/Card';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppSettings } from 'src/app/app.config';


@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private http:HttpClient) { }

  createCard(card:Card):Observable<Card>{
    //if a cardId exists, just update the card
    if (card.cardId){
      return this.http
     .put<any>( AppSettings.API_ENDPOINT +'cards',card)
    }
    return this.http
     .post<any>( AppSettings.API_ENDPOINT +'cards',card);
  }

  getCard(id:string):Observable<Card>{
    return this.http
      .get<Card>( AppSettings.API_ENDPOINT +'cards/'+id)
      .pipe(map(res => res['card']));
  }

  getCardsForThema(tags:string[]=[]):Observable<Card[]>{
    return this.http
      .get<Card[]>( AppSettings.API_ENDPOINT +'cards',{params:{'tags':tags}})
      .pipe(map(res => res['cards']))
  }
}
