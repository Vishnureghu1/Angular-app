import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-updatevendor',
  templateUrl: './updatevendor.component.html',
  styleUrls: ['./updatevendor.component.css']
})
export class UpdatevendorComponent implements OnInit {

  constructor(private heroservice : HeroService , private router : Router) { }

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
    let vendorId = localStorage.getItem("editvendorId");
    this.heroservice.getvendor(vendorId).subscribe((data)=>{
      this.vendorItem=JSON.parse(JSON.stringify(data));
    })
  }

  updatevendor()
  { 
    let vendorId = localStorage.getItem("editvendorId");  
    this.heroservice.editvendor(this.vendorItem , vendorId)
    .subscribe((data:any) =>{console.log(data)
      if(data.error==false){
        alert("Vendor updated Successfully")
      }
      else{
        alert("Vendor update failed")
      }
        this.router.navigate(['/admindashboard/vendors']);  
      })   
   
  }

}
