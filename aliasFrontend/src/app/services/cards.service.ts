import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../models/Card';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private http:HttpClient) { }

  createCard(card:Card):Observable<Card>{
    return this.http
     .post<any>('http://localhost:5000/cards',card);
  }

  updateCard(card:Card):Observable<Card>{
    return this.http
     .put<any>('http://localhost:5000/cards',card)
  }
}
