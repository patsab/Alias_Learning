import { Component, OnInit } from '@angular/core';

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

  newThema:Thema;

  constructor(private router: Router, private filterService: FilterService) { }

  ngOnInit(): void {
    //if the user hasn't a valid session, he will be routed to the login page
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login'])
    }
  }

  createThema(userInput:string):void{
    //split the user Input in a string array
    let tags:string[];
    tags = userInput.split(",");
    //remove leading and trailing whitespaces for each string
    tags.map(Function.prototype.call,String.prototype.trim)

    //create a new Thema, which will be inserted in the DB
    this.newThema={
      email:sessionStorage.getItem('email'),
      filter:tags,
    };

    //Trigger Post Method from the filter Service
    this.filterService.addThema(this.newThema).subscribe();

    //reroute the user back to the overview page
    this.router.navigate(['/home']);
  }

}
