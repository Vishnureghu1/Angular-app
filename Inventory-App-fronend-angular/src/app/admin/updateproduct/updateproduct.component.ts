import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.css']
})
export class UpdateproductComponent implements OnInit {

  constructor(private heroservice : HeroService, private router : Router) { }
  categories : any = [];
  selectedFile: any = null;
  fd = new FormData();
  productItem : any= {
    productname :'',
    barcodeorqrcode:'',
    categoryname:'',
            
    }  

  createFormData(event:any) {
    this.selectedFile = <File>event.target.files[0];
    this.fd.append('image', this.selectedFile, this.selectedFile.name);
   }

  ngOnInit(): void {
    let productId = localStorage.getItem("editProductId");
    this.heroservice.getproduct(productId).subscribe((data)=>{
      this.productItem=JSON.parse(JSON.stringify(data));
    })
    this.heroservice.getcategories().subscribe((data:any)=>{
      this.categories=data;
      })    
  }

  Addproduct()
  {        
    let productId = localStorage.getItem("editProductId");
    for (const prop in this.productItem)
    {
      this.fd.append(prop, this.productItem[prop]);
    }
    
    this.heroservice.editProduct(this.fd , productId)
    .subscribe((data:any) =>{console.log(data)
      if(data.error==false){
        alert("Product Updated Successfully"); 
      }
      else{
        alert("Product Updation failed"); 
      }        
        this.router.navigate(['/admindashboard/product']);
      })
        
    
  }

}
