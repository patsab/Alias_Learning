import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

//import the classes to know about the data structure
import { Filter,Thema } from '../../models/Filter';

//the Service is imported and injected, so the data can be retrieved from it
import { FilterService } from  '../../services/filter.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-thema',
  templateUrl: './create-thema.component.html',
  styleUrls: ['./create-thema.component.css']
})
export class CreateThemaComponent implements OnInit {

  @ViewChild('userInput') userInput:ElementRef;

  newThema:Thema;
  tags:string[]=["Fach1","Fach2"];
  myControl = new FormControl();
  options:String[];

  constructor(private router: Router, private filterService: FilterService) { }

  ngOnInit(): void {
    this.getAvailableTags();
  }

  createThema():void{
  

    //create a new Thema, which will be inserted in the DB
    this.newThema={
      email:sessionStorage.getItem('email'),
      filter:this.tags,
    };

    //Trigger Post Method from the filter Service
    //after that, reroute the user to the home page
    this.filterService.addThema(this.newThema).subscribe(res => this.router.navigate(['/home']));

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
        this.tags.push(tag.trim());}
    }else{
      this.tags.push(tag.trim());
    }

    this.userInput.nativeElement.value='';

  }
}
