import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HeroService } from './admin/hero.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private injector:Injector) { }
  intercept(req:any,nxt:any)
  {
    let authService = this.injector.get(HeroService)
    let tokenizedReq = req.clone(
      {
        setHeaders:{
          Authorization:`Bearer ${authService.getToken()}`
        }
      }
    )
    return nxt.handle(tokenizedReq)

  }
}
