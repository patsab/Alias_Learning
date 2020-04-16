import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { QuestionComponent } from './components/question/question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateThemaComponent } from './components/create-thema/create-thema.component';
import { ThemaOverviewComponent } from './components/thema-overview/thema-overview.component';


const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch: 'full'},
  {path: 'login',component: LoginComponent},
  {path: 'home', component: DashboardComponent},
  {path: 'create/thema', component: CreateThemaComponent},
  {path: 'thema',component: ThemaOverviewComponent},
  {path: '**',redirectTo:'home', pathMatch:'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }