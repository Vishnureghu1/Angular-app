import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  constructor(private heroservice: HeroService, private router: Router) { }
  products: any = [];
  categories: any = [];
  categoryname : any = [];
  showImage: boolean = false;
  imageWidth: number = 60;
  imageheight: number = 60;
  imageMargin: number = 2;
  ngOnInit(): void {
    this.heroservice.getproducts().subscribe((data: any) => {
      console.log(data);
      this.products = data;     
      })
      this.heroservice.getcategories().subscribe((data: any) => {
        this.categories = data;
      })
    }
    search() {                    
      this.heroservice.getproductsoncategory(this.categoryname)
        .subscribe(data => {
          console.log(data);
          this.products=data;
        })
      }
editProduct(product: any){
      localStorage.setItem("editProductId", product._id.toString());
      this.router.navigate(['/admindashboard/updateproduct']);
    }
deleteProduct(product: any)
  {
        alert("Do yoy want to delete the product")
    this.heroservice.deleteProduct(product._id)
          .subscribe((data:any) => {
            this.products = this.products.filter((p: any) => p !== product);
            if(data.error==false){
              alert("Deleted the product successfully");
            }
            else{
              alert("Deletion of product failed");
            }
            this.router.navigate(['/admindashboard']);
          })


      }
}
