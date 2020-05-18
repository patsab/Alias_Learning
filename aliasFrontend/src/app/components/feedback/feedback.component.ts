import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Feedback } from 'src/app/models/Feedback';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  @ViewChild('design') design:ElementRef;
  @ViewChild('functionality') functionality:ElementRef;
  @ViewChild('usability') usability:ElementRef;

  constructor(private breakpointObserver: BreakpointObserver
    ,private feedbackService:FeedbackService
    ,private router:Router) { }

  ngOnInit(): void {
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  feedbackAbgeben(){
    // if one of the fields is empty, it would cause an error if they would be direct assigned
    // so it will first be checked if they aren't empty, then assigned
    let design = (this.design.nativeElement.value != '') ? this.design.nativeElement.value : '';
    let functionality = (this.functionality.nativeElement.value != '') ? this.functionality.nativeElement.value : '';
    let usability = (this.usability.nativeElement.value != '') ? this.functionality.nativeElement.value : '';

    //create the feedback element which will be send to the backend
    let feedback:Feedback ={
      email:sessionStorage.getItem("email"),
      design:design,
      functionality:functionality,
      usability:usability,
    }

    //Direct to a feedback-thx page
    this.feedbackService.addFeedback(feedback).subscribe(res => this.router.navigate(['/home/feedbackthx']))

  }
}
