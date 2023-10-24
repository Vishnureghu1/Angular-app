import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})
export class CreateproductComponent implements OnInit {

  constructor(private heroservice : HeroService , private router : Router ) { }
 
 
  categories : any = [];
  categorytype:any=["solid","liquid","number"];  
  atrributetype:any=["ml","gram"];
  bool=0;
  selectedFile: any = null;
  fd = new FormData();
  productItem : any= {
    productname :'',
    barcodeorqrcode:'',
    categoryname:'',
            
    }  
    selectone(){      
      console.log(this.productItem.type);
      if(this.productItem.type=="solid"){
        this.productItem.attribute="gram"
        this.bool=1;
      }
      if(this.productItem.type=="liquid"){
        this.productItem.attribute="ml"
        this.bool=1;
      }
      if(this.productItem.type=="number"){
       // this.attribute="qty"
        this.bool=2
      }
      
      
    }

  createFormData(event:any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
    
    this.fd.append('image', this.selectedFile, this.selectedFile.name);
   }

  ngOnInit(): void {
    this.heroservice.getcategories().subscribe((data:any)=>{
      this.categories=data;
  })
  }
  Addproduct()
  {        
    for (const prop in this.productItem)
    {
      this.fd.append(prop, this.productItem[prop]);
      console.log(this.fd);
      
    }
    
    this.heroservice.newproduct(this.fd)
    .subscribe((data:any) =>
      {console.log(data);
        if(data.error==false){
        alert("Product added Successfully")
        }
        else{
          alert("Product addition failed")
        }
        this.router.navigate(['/admindashboard/product']);
      })    
   
    
  }
  
}
