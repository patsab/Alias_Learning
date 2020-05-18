import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedbackthx',
  templateUrl: './feedbackthx.component.html',
  styleUrls: ['./feedbackthx.component.css']
})
export class FeedbackthxComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  navigateHome(){
    this.router.navigate(['/home'])
  }

}
