import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }
 // api = '/api';
 api = "http://localhost:3000";
  
  loginuser(user:any){
    console.log(user)
return this.http.post<any>(this.api+"/admin/login",user)

  }
  loggedIn()
  {
    return !!localStorage.getItem('token')
  }
  getToken()
  {
    return localStorage.getItem('token')
  }
  
}
