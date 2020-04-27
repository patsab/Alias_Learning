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

  myControl = new FormControl();
  options:string[]=[];
  filteredOptions: Observable<string[]>;


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
    
    this.getAvailableTags();

    this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        )
  }

  createCard(answer:string,question:string){
    
    if (answer=="" || question=="" ){
      return
    }
    
    this.card={
      'email':sessionStorage.getItem('email'),
      'answer':answer,
      'question':question,
      'tags': this.cardTags,
    }

    this.cardService.createCard(this.card).subscribe(
      res => this.router.navigate(['/thema'],{queryParams:{tags:this.tags}}));

  }

  //get all available Projects
  getAvailableTags():void{
    this.filterService.getAvailableTags().subscribe(res => {this.options = res})
  }

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

  deleteTag(tagToDel:string):void{
    this.cardTags = this.cardTags.filter(tag => tag !== tagToDel);
  }

  private _filter(tag: string): string[] {
    const filterValue = tag.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
