import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'src/app/models/Card';
import { CardsService } from 'src/app/services/cards.service';
import { FilterService } from 'src/app/services/filter.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map,startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css']
})
export class CreateCardComponent implements OnInit {

  @ViewChild('userInput') userInput:ElementRef;
  
  //one tag array is for all tags, including additional tags for the card
  cardTags:string[]=[];
  //the other tag array is for redirecting to the the overview page
  tags:string[];
  card:Card;
  cardID:string;

  //field for autocompletion 
  myControl = new FormControl();
  options:string[]=[];
  filteredOptions: Observable<string[]>;

  //elements for the fields in the html
  @ViewChild('question') questionField:ElementRef;
  @ViewChild('answer') answerField:ElementRef;

  constructor(private route:ActivatedRoute
    ,private cardService:CardsService
    ,private filterService:FilterService
    ,private router:Router) { }

  ngOnInit(): void {
    //get the tags out of the url
    this.route.queryParamMap.subscribe(params => {this.tags = params.getAll('tags');
        for(let tag of this.tags){
          this.cardTags.push(tag)
        };});
    
    //get the update query 
    this.route.queryParamMap.subscribe(params =>{
      this.cardID = params.get('cardId');})
    
    //if an cardId is provided, get the data from the card
    this.getCardData()

    //get data for autocompletion
    this.getAvailableTags();
    this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        )
  }

  //create the card if the button is pressed
  createCard(answer:string=this.answerField.nativeElement.value
    ,question:string=this.questionField.nativeElement.value){
    
    if (answer=="" || question=="" ){
      return
      
    }
    
    this.card={
      'email':sessionStorage.getItem('email'),
      'answer':answer,
      'question':question,
      'tags': this.cardTags,
    }
    //add the card id
    if(this.cardID){
      this.card.cardId=this.cardID;
    }

    this.cardService.createCard(this.card).subscribe(
      res => this.router.navigate(['home/thema'],{queryParams:{tags:this.tags}}));

  }

  //get all available Projects
  getAvailableTags():void{
    this.filterService.getAvailableTags().subscribe(res => {this.options = res})
  }

  //get the data end set it to the appropiate values
  getCardData():void{
    this.cardService.getCard(this.cardID).subscribe(res => { this.card = res;
      this.questionField.nativeElement.value = res['question'];
      this.answerField.nativeElement.value = res['answer'];
      this.cardTags = res['tags']})
  }

  //add an additional tag like 
  addTag(tag:string=this.userInput.nativeElement.value):void{
    //add the new tag to the array
    //if user inputs multiple tags with , between, all will be added
    if(tag.includes(',')){
      let newTags= tag.split(",");
      for(let tag of newTags){
        if (!this.cardTags.includes(tag)){
          this.cardTags.push(tag.trim());}
        }
    }else{
      if (!this.cardTags.includes(tag)){
        this.cardTags.push(tag.trim());
      }
    }

    this.userInput.nativeElement.value='';
  }

  //delete an tag for the card
  deleteTag(tagToDel:string):void{
    this.cardTags = this.cardTags.filter(tag => tag !== tagToDel);
  }

  //this is used for the search of autocompletion
  private _filter(tag: string): string[] {
    const filterValue = tag.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
