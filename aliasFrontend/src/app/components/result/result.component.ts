import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  //the tags are needed for reedirecting the user to the next question
  tags:string[];
  predictedCorrectness:number;
  correctAnswer:string;
  //This var saves the result which is shown in the frontend
  stringToShow:string;

  constructor(private router:Router
        ,private route:ActivatedRoute) { }

  ngOnInit(): void {

    //get the tags out of the url
    this.route.queryParamMap.subscribe(params => {
      this.tags = params.getAll('tags');
      this.predictedCorrectness = +params.get('predictedCorrectness')
      this.correctAnswer = params.get('correctAnswer')});

    //if predictedCorrectness is undefined, just show the correct Answer
    if (!this.predictedCorrectness){
      this.stringToShow = "Die richtige Antwort wäre gewesen: \n " + this.correctAnswer;
    }else{
      this.stringToShow = `Die Antworten stimmen zu ${this.predictedCorrectness} % überein`;
    }

  }

  nextQuestion():void{
    this.router.navigate(['/question'],{queryParams:{tags:this.tags}});
  }

}
