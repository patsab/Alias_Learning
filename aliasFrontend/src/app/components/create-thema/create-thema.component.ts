import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map,startWith, shareReplay } from 'rxjs/operators';

//import the classes to know about the data structure
import { Filter,Thema, TagRecommendation } from 'src/app/models/Filter';

//the Service is imported and injected, so the data can be retrieved from it
import { FilterService } from  'src/app/services/filter.service'
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-create-thema',
  templateUrl: './create-thema.component.html',
  styleUrls: ['./create-thema.component.css']
})
export class CreateThemaComponent implements OnInit {

  @ViewChild('userInput') userInput:ElementRef;

  newThema:Thema;
  tags:string[]=[];
  recommendation:TagRecommendation[]=[];

  //these properties are used for autocomplete
  myControl = new FormControl();
  options:string[]=[];
  filteredOptions: Observable<string[]>;

  constructor(private router: Router
    , private route: ActivatedRoute
    , private filterService: FilterService
    ,private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    //get all tags from db
    this.getAvailableTags();

    //create an option, so the autocompletion adapts to the user input
    this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        )
  }

  private _filter(tag: string): string[] {
    const filterValue = tag.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  createThema():void{
    
    if (this.userInput.nativeElement.value != ''){
      this.addTag(this.userInput.nativeElement.value)
      this.router.navigate(['home'], {relativeTo: this.route});   
    }

    //create a new Thema, which will be inserted in the DB
    this.newThema={
      email:sessionStorage.getItem('email'),
      filter:this.tags,
    };

    //Trigger Post Method from the filter Service
    //after that, reroute the user to the home page
    this.filterService.addThema(this.newThema).subscribe(res => this.router.navigate(['/home']));

  }

  //get all available tags 
  getAvailableTags():void{
    this.filterService.getAvailableTags().subscribe(res => {this.options = res});
    this.filterService.getFilterWithCountOfQuestions().subscribe(res => {this.recommendation = res});
  }

  addTag(tag:string=this.userInput.nativeElement.value):void{
    //add the new tag to the array
    //if user inputs multiple tags with , between, all will be added
    if(tag.includes(',')){
      let newTags= tag.split(",");
      for(let tag of newTags){
        if (!this.tags.includes(tag)){
          this.tags.push(tag.trim());}
        }
    }else{
      if (!this.tags.includes(tag)){
        this.tags.push(tag.trim());
      }
    }

    this.userInput.nativeElement.value='';
  }

  deleteTag(tagToDel:string):void{
    this.tags = this.tags.filter(tag => tag !== tagToDel);
  }

  createExistingThema(thema:TagRecommendation):void{
    this.addTag(thema.tag);
    this.createThema();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
}
