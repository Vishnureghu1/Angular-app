import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { jsPDF } from 'jspdf'
import { DatePipe } from '@angular/common';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-stockinhistory',
  templateUrl: './stockinhistory.component.html',
  styleUrls: ['./stockinhistory.component.css']
})
export class StockinhistoryComponent implements OnInit {

  products : any=[];  
  categories: any=[];
  statistics : any = [];
  categoryname : any = [];
  constructor(private heroservice : HeroService) { }

  ngOnInit(): void {
    this.heroservice.getstockins().subscribe((data:any)=>{
      console.log(data);
      
      this.products=data;
  })
  this.heroservice.getcategories().subscribe((data: any) => {
    this.categories = data;
  })
  this.heroservice.getstatistics().subscribe((data:any)=>{
    console.log(data);
    
    this.statistics=data;
})
  }
  search() {                    
    this.heroservice.getinventoryoncategory(this.categoryname)
      .subscribe(data => {
        console.log(data);
        this.products=data;
      })
    }
   

  captureScreen() {
    console.log(this.products);
    const doc = new jsPDF('l', 'mm', 'a4');
    let newdata: any = [];
    let c: number = 0;
    const d = new Date();
    const head = [['Product', 'Qr/Barcode', 'Category' , 'Quantity']]
    for (let i=0;i<this.products.length;i++) {      
        newdata[i] = new Array();
       
    }
    c = 0;

    for (let productitem of this.products) {      
        newdata[c][0] = productitem.productname;
        c++;
      }
    
    for (let i = 0; i < this.products.length; i++) {
      
        
        newdata[i][0] = this.products[i].productname.toUpperCase() ;       
        newdata[i][1] = this.products[i].barcodeorqrcode ;
        newdata[i][2] = this.products[i].categoryname.toUpperCase();
        newdata[i][3] = this.products[i].qty;
        c++;
      
    }
    autoTable(doc, {
      head: head,
      body: newdata,
      didDrawCell: (data) => { },
    });

    doc.save(`Stockreport_${d}.pdf`);
  }

}
