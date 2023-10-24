import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {

  
  constructor(private heroservice : HeroService , private router : Router) { }

  attributes : any=[];
  showImage: boolean = false;
  imageWidth: number = 60;
  imageheight: number = 60;
  imageMargin: number = 2;

  ngOnInit(): void {
    this.heroservice.getattributes().subscribe((data: any) => {
      this.attributes = data;
    })
  }

  editattribute(attribute:any){
    localStorage.setItem("editattributeId", attribute._id.toString());
    this.router.navigate(['/admindashboard/updateattribute']);
  }
  deleteattribute(attribute:any)
    {
      alert("Do yoy want to delete the attribute")
      // this.heroservice.deleteattribute(attribute._id)
      //   .subscribe((data:any) => {
      //     this.attributes = this.attributes.filter((p: any) => p !== attribute);
      //     if(data.error==false){
      //       alert("attribute deleted sucessfully")
      //     }
      //     else{
      //       alert("Failed to delete attribute")
      //     }
      //   })
        this.router.navigate(['/admindashboard/categories']);
  
    }


}
