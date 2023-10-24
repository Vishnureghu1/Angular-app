import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-updateattribute',
  templateUrl: './updateattribute.component.html',
  styleUrls: ['./updateattribute.component.css']
})
export class UpdateattributeComponent implements OnInit {

  constructor(private heroservice : HeroService, private router : Router) { }

  attributeItem : any= {
    attributename :'',
    
    }  
   

  ngOnInit(): void {
    let attributeId = localStorage.getItem("editattributeId");
    this.heroservice.getattribute(attributeId).subscribe((data)=>{
      this.attributeItem=JSON.parse(JSON.stringify(data));
    })
  }

  Editattribute()
  {        
    let attributeId = localStorage.getItem("editattributeId");
    // for (const prop in this.attributeItem)
    // {
    //   this.fd.append(prop, this.attributeItem[prop]);
    // }
    
    this.heroservice.editattribute(this.attributeItem , attributeId)
    .subscribe((data:any) =>{
      console.log(data)
    if(data.error==false){
      alert("attribute Updated Sucessfully");    
        this.router.navigate(['/admindashboard/attributes']);
    }
    else{
      alert("attribute Update Failed");    
        this.router.navigate(['/admindashboard/attributes']);
    }
    })
   
    
  }

}
