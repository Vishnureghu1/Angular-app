import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-createvendor',
  templateUrl: './createvendor.component.html',
  styleUrls: ['./createvendor.component.css']
})
export class CreatevendorComponent implements OnInit {

  constructor(private heroservice : HeroService, private router : Router) { }
  
  vendorItem : any= {
    vendor :'',
    line1:'',
    line2:'',
    town:'',
    postcode:'',
    phonenumber:'',
    emailid:'',
    country:'',
    contactperson : ''
    }  
    

  ngOnInit(): void {    
  }
  Addvendor()
  {        
       
    this.heroservice.newvendor(this.vendorItem)
    .subscribe((data:any) =>
      {console.log(data);
        if(data.error==false){          
            alert("Vendor created successfully")
          }
          else{
            alert("Vendor creation failed")
          }        
        this.router.navigate(['/admindashboard/vendors']);
      })    
   
    
  }

}
