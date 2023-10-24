import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements OnInit {

  constructor(private router:ActivatedRoute,private heroservice : HeroService) { }
  Id:any="";
  expproducts:any=[];
  checkoutdetails:any=[];
  ngOnInit(): void {
    
    this.router.paramMap.subscribe((params) =>
      {              
       this.Id =params.get("id")
        console.log(this.Id)
         this.heroservice.getcheckoutdetails(this.Id).subscribe((data:any)=>{
          this.checkoutdetails=data
          if(data.expiryarray.length>0)
           this.expproducts=data.expiryarray;
           else
           this.expproducts=data.products;
        })
      })   
  }

  
  captureScreen() {
    console.log(this.expproducts);
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text(`Stock Out Expiry Report for checkoutId - ${this.checkoutdetails.checkoutId}`, 20, 20, );
    let newdata: any = [];
    let c: number = 0;
    const d = new Date(); 
   
    const head = [[ 'Product', 'Qr/Barcode', 'Category' , 'Quantity','Expiy Date']]
    for (let item of this.expproducts) {     
        newdata[c] = new Array();
        c++;      
    }
    c = 0;

    for (let productitem of this.expproducts) {      
        newdata[c][0] = productitem.productname     
    }
    for (let i = 0; i < this.expproducts.length; i++) {            
        newdata[c][0] = this.expproducts[i].productname.toUpperCase() ;       
        newdata[c][1] = this.expproducts[i].barcodeorqrcode ;
        newdata[c][2] = this.expproducts[i].categoryname.toUpperCase();
        newdata[c][3] = this.expproducts[i].qty;
        newdata[c][4] = this.expproducts[i].exp;
        c++;     
    }
    //let docr= "ffffff"
    autoTable(doc,  {
      margin: {top: 80,bottom:50,left:20},
        startY:30,
        //tableWidth: 200,
      head: head,
      body: newdata,
      didDrawCell: (data) => { },
    });

    doc.save(`checkoutId-${this.checkoutdetails.checkoutId}_${d}.pdf`);
  }

}
