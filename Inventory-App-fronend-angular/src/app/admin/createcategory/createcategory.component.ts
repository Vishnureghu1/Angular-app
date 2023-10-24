import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-createcategory',
  templateUrl: './createcategory.component.html',
  styleUrls: ['./createcategory.component.css']
})
export class CreatecategoryComponent implements OnInit {

  constructor(private heroservice : HeroService, private router : Router) { }
  
  selectedFile: any = null;
  fd = new FormData();
  categoryItem : any= {
    categoryname :'',
             
    }  

    createFormData(event:any) {
      this.selectedFile = <File>event.target.files[0];
      this.fd.append('image', this.selectedFile, this.selectedFile.name);
     }

  ngOnInit(): void {    
  
  }

  Addcategory()
  {        
    for (const prop in this.categoryItem)
    {
      this.fd.append(prop, this.categoryItem[prop]);
    }
    
    this.heroservice.newcategory(this.fd)
    .subscribe((data:any) =>
      {console.log(data);
        if(data.error==false){
        alert("Category Created Sucessfully")
        }
        else{
          alert("Category Creation failed")
        }
        this.router.navigate(['/admindashboard/categories']);
      })    
   
    
  }

}
