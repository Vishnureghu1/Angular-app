import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-catogories',
  templateUrl: './catogories.component.html',
  styleUrls: ['./catogories.component.css']
})
export class CatogoriesComponent implements OnInit {
  

  constructor(private heroservice : HeroService , private router : Router) { }

  categorys : any=[];
  showImage: boolean = false;
  imageWidth: number = 60;
  imageheight: number = 60;
  imageMargin: number = 2;

  ngOnInit(): void {
    this.heroservice.getcategories().subscribe((data:any)=>{
      this.categorys=data;
  })
  }

  editcategory(category:any){
    localStorage.setItem("editcategoryId", category._id.toString());
    this.router.navigate(['/admindashboard/updatecategory']);
  }
  deletecategory(category:any)
    {
      alert("Do yoy want to delete the category")
      this.heroservice.deletecategory(category._id)
        .subscribe((data:any) => {
          this.categorys = this.categorys.filter((p: any) => p !== category);
          if(data.error==false){
            alert("Category deleted sucessfully")
          }
          else{
            alert("Failed to delete category")
          }
        })
        this.router.navigate(['/admindashboard/categories']);
  
    }

}
