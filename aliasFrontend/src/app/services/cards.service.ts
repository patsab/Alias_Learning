import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../models/Card';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private http:HttpClient) { }

  createCard(card:Card):Observable<Card>{
    //if a cardId exists, just update the card
    if (card.cardId){
      return this.http
     .put<any>('http://localhost:5000/cards',card)
    }
    return this.http
     .post<any>('http://localhost:5000/cards',card);
  }

  getCard(id:string):Observable<Card>{
    return this.http
      .get<Card>('http://localhost:5000/cards/'+id)
      .pipe(map(res => res['card']));
  }

  getCardsForThema(tags:string[]=[]):Observable<Card[]>{
    console.log("testlog")
    return this.http
      .get<Card[]>('http://localhost:5000/cards',{params:{'tags':tags}})
      .pipe(map(res => res['cards']))
  }
}
