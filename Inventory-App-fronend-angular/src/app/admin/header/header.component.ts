import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _router : Router, public auth :AuthService) { }

  ngOnInit(): void {
  }

  logoutUser()
{
localStorage.removeItem('token')
this._router.navigate([''])
}


}
