import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-updatecategory',
  templateUrl: './updatecategory.component.html',
  styleUrls: ['./updatecategory.component.css']
})
export class UpdatecategoryComponent implements OnInit {

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
    let categoryId = localStorage.getItem("editcategoryId");
    this.heroservice.getcategory(categoryId).subscribe((data)=>{
      this.categoryItem=JSON.parse(JSON.stringify(data));
    })
  }

  Editcategory()
  {        
    let categoryId = localStorage.getItem("editcategoryId");
    for (const prop in this.categoryItem)
    {
      this.fd.append(prop, this.categoryItem[prop]);
    }
    
    this.heroservice.editcategory(this.fd , categoryId)
    .subscribe((data:any) =>{
      console.log(data)
    if(data.error==false){
      alert("Category Updated Sucessfully");    
        this.router.navigate(['/admindashboard/categories']);
    }
    else{
      alert("Category Update Failed");    
        this.router.navigate(['/admindashboard/categories']);
    }
    })
   
    
  }

}
