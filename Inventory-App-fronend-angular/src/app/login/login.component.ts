import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth :AuthService, private _router :Router) { }
  user={email:'',password:''}
  
  

  ngOnInit(): void {
  }
  loginUser () {
    console.log(this.user)
    this.auth.loginuser(this.user)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token);
        //localStorage.setItem('role', res.role);
        //this.auth.role=res.role
        console.log(res.token)   
        //console.log(res.role)       
       // alert("sucess. Logged in as "+res.role);
        this._router.navigate(['/admindashboard'])
      },
      err => {
        console.log(err);
        this._router.navigate(['/'])
      }
    ) 
  }
}
