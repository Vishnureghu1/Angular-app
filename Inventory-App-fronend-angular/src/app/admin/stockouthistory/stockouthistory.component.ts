import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';
import { jsPDF } from 'jspdf'
import { DatePipe } from '@angular/common';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-stockouthistory',
  templateUrl: './stockouthistory.component.html',
  styleUrls: ['./stockouthistory.component.css']
})
export class StockouthistoryComponent implements OnInit {
  
  constructor(private heroservice : HeroService, private router : Router) { }
  products : any=[];
  daterange: any = {};

  ngOnInit(): void {
    this.heroservice.getstockouts().subscribe((data:any)=>{
      console.log(data);
     
      this.products=data;
  })
  }
  checkstartDate(event: any) {
    console.log(event.target.value);   
    this.daterange.startdate = event.target.value
    console.log(this.daterange.startdate);
  }
  checkendDate(event: any) {
    console.log(event.target.value);    
    this.daterange.enddate = event.target.value
    console.log(this.daterange.enddate);
  }
  search() {
    console.log(this.daterange);
    this.heroservice.getstockouthistorydaterange(this.daterange)
      .subscribe(data => {
        console.log(data);
        this.products = data;
      })
  }

  captureScreen() {
    console.log(this.products);
    const doc = new jsPDF('l', 'mm', 'a4');
    let newdata: any = [];
    let c: number = 0;
    const d = new Date();
    const head = [['Checkout Id', 'Date', 'Product', 'Qr/Barcode', 'Category' , 'Quantity']]
    for (let item of this.products) {
      for (let product of item.products) {
        newdata[c] = new Array();
        c++;
      }
    }
    c = 0;

    for (let productitem of this.products) {
      for (let productdata of productitem.products) {
        newdata[c][0] = productdata.productname
      }
    }
    for (let i = 0; i < this.products.length; i++) {
      for (let x = 0; x < this.products[i].products.length; x++) {
        newdata[c][0] = this.products[i].checkoutId;
        newdata[c][1] = this.products[i].date;
        newdata[c][2] = this.products[i].products[x].productname.toUpperCase() ;       
        newdata[c][3] = this.products[i].products[x].barcodeorqrcode ;
        newdata[c][4] = this.products[i].products[x].categoryname.toUpperCase();
        newdata[c][5] = this.products[i].products[x].qty;
        c++;
      }
    }
    autoTable(doc, {
      head: head,
      body: newdata,
      didDrawCell: (data) => { },
    });

    doc.save(`Stockouthistory_${d}.pdf`);
  }
  

}
