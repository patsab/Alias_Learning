import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  constructor(private router: Router) { 
  }
  
  logout(){
    //set session vars for user to false
    sessionStorage.clear();
  }

  login(email:string) {
    email = email.toLowerCase();
    if(email.endsWith('@th-nuernberg.de')){
      //set session vars for user
      sessionStorage.setItem('email',email);

      //redirect the user to overview page
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.logout();
  }

}
