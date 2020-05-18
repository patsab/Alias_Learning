import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { QuestionComponent } from './components/question/question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateThemaComponent } from './components/create-thema/create-thema.component';
import { ThemaOverviewComponent } from './components/thema-overview/thema-overview.component';
import { ResultComponent } from './components/result/result.component';
import { EvaluateAnswersComponent } from './components/evaluate-answers/evaluate-answers.component';
import { CreateCardComponent } from './components/create-card/create-card.component';
import { CardOverviewComponent } from './components/card-overview/card-overview.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackthxComponent } from './components/feedbackthx/feedbackthx.component';


const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch: 'full'},
  {path: 'login',component: LoginComponent},
  {path: 'home', component: MainNavComponent,
    children:[
      {path: '', component: DashboardComponent},
      {path: 'create/thema', component: CreateThemaComponent},
      {path: 'evaluate',component: EvaluateAnswersComponent},
      {path: 'thema',component: ThemaOverviewComponent},
      {path: 'create/card', component:CreateCardComponent},
      {path: 'question',component: QuestionComponent},
      {path: 'result',component: ResultComponent},
      {path: 'cards/overview',component: CardOverviewComponent},
      {path: 'feedback',component:FeedbackComponent},
      {path: 'feedbackthx',component:FeedbackthxComponent},
    ]},
  {path: '**',redirectTo:'home', pathMatch:'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }