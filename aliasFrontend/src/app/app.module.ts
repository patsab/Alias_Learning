import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from  '@angular/material/autocomplete';

import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginComponent } from './components/login/login.component';
import { QuestionComponent } from './components/question/question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { CreateThemaComponent } from './components/create-thema/create-thema.component';
import { ThemaOverviewComponent } from './components/thema-overview/thema-overview.component';
import { ResultComponent } from './components/result/result.component';
import { EvaluateAnswersComponent } from './components/evaluate-answers/evaluate-answers.component';
import { CreateCardComponent } from './components/create-card/create-card.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CardOverviewComponent } from './components/card-overview/card-overview.component';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { AppSettings } from './app.config' 

import { AuthModule, OidcConfigService, LogLevel } from 'angular-auth-oidc-client';
import { AuthInterceptor } from './scripts/AuthInterceptor'

//load the config for the oicd-module
export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.withConfig({
    stsServer: "http://git.informatik.fh-nuernberg.de",///oauth/authorize",
    redirectUrl: AppSettings.FRONTEND_URI +"/home",
    clientId: "5f3fb8e3039da539f2465f39d10a4aad5336d8c7b4080b5893c97a40db81b8da",//Application ID aus gitlab
    responseType: "code",
    scope: "openid profile email",
    postLogoutRedirectUri: AppSettings.FRONTEND_URI+"/login",
    //postLoginRoute: "/home",
    //autoUserinfo: true,
    storage:sessionStorage,
    logLevel: LogLevel.Debug,
    }
    /*,{"issuer":"https://git.informatik.fh-nuernberg.de",
    "authorization_endpoint":"https://git.informatik.fh-nuernberg.de/oauth/authorize",
    "token_endpoint":"https://git.informatik.fh-nuernberg.de/oauth/token",
    "revocation_endpoint":"https://git.informatik.fh-nuernberg.de/oauth/revoke",
    "introspection_endpoint":"https://git.informatik.fh-nuernberg.de/oauth/introspect",
    "userinfo_endpoint":"https://git.informatik.fh-nuernberg.de/oauth/userinfo",
    "jwks_uri":"https://git.informatik.fh-nuernberg.de/oauth/discovery/keys",
    "scopes_supported":["api","read_user","read_repository","write_repository","sudo","openid","profile","email"],
    "response_types_supported":["code","token"],
    "response_modes_supported":["query","fragment"],
    "token_endpoint_auth_methods_supported":["client_secret_basic","client_secret_post"],
    "subject_types_supported":["public"],
    "id_token_signing_alg_values_supported":["RS256"],
    "claim_types_supported":["normal"],
    "claims_supported":["iss","sub","aud","exp","iat","sub_legacy","name","nickname","email","email_verified","website","profile","picture","groups"]}
  */);
}

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LoginComponent,
    QuestionComponent,
    DashboardComponent,
    CreateThemaComponent,
    ThemaOverviewComponent,
    ResultComponent,
    EvaluateAnswersComponent,
    CreateCardComponent,
    CardOverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    MatMenuModule,
    HttpClientModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    AuthModule.forRoot(),
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

