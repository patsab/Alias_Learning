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


const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch: 'full'},
  {path: 'login',component: LoginComponent},
  {path: 'home', component: DashboardComponent},
  {path: 'create/thema', component: CreateThemaComponent},
  {path: 'create/card', component:CreateCardComponent},
  {path: 'thema',component: ThemaOverviewComponent},
  {path: 'question',component: QuestionComponent},
  {path: 'result',component: ResultComponent},
  {path: 'evaluate',component: EvaluateAnswersComponent},
  {path: 'cards/overview',component: CardOverviewComponent},
  {path: '**',redirectTo:'home', pathMatch:'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }