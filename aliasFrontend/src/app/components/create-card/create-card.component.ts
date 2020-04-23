import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'src/app/models/Card';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css']
})
export class CreateCardComponent implements OnInit {

  tags:string[];
  card:Card;

  constructor(private route:ActivatedRoute
    ,private cardService:CardsService
    ,private router:Router) { }

  ngOnInit(): void {
    //get the tags out of the url
    this.route.queryParamMap.subscribe(params => this.tags = params.getAll('tags'));
  }

  createCard(answer:string,question:string,additionalTags:string=""){
    if (answer=="" || question=="" ){
      return
    }
    
    let newTags:string[]=additionalTags.split(",");
    //newTags.map(Function.prototype.call,String.prototype.trim);
    newTags= newTags.concat(this.tags);

    this.card={
      'email':sessionStorage.getItem('email'),
      'answer':answer,
      'question':question,
      'tags': newTags,
    }

    this.cardService.createCard(this.card).subscribe(
      res => this.router.navigate(['/thema'],{queryParams:{tags:this.tags}}));

  }

}
