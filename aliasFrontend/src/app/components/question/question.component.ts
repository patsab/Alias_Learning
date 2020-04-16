import { Component, OnInit } from '@angular/core';

import { Filter,Thema } from '../../models/Filter';
import { Router } from '@angular/router';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  tags:string[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    //if the user hasn't a valid session, he will be routed to the login page
    if (!sessionStorage.getItem('email')){
      this.router.navigate(['/login'])
    }
  }

}
