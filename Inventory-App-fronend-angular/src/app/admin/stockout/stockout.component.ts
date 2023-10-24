import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stockout',
  templateUrl: './stockout.component.html',
  styleUrls: ['./stockout.component.css']
})
export class StockoutComponent implements OnInit {
  
  productcount : any=0;
  count : any =0;
  title = 'Working With Array In Angular 5';
  randomnumber =  Math.floor(100000 + Math.random() * 900000); 

  categories : any = [];
  // Array where we are going to do CRUD operations    
  myItems: any = [];

  stockout : any = {
    checkoutId : this.randomnumber,
    user: {
      fname : 'Admin',
      lname: 'User',
      email :'testemail@example.com'
    },
    products: this.myItems
   } ;
  // Other variables   
  
  IsForUpdate: boolean = false;
  newItem: any = {};
  updatedItem: any;
  attributes:any=[];
  editIndex : number = -1;
  vendors : any=[];
  neprod : any = [];
  isforAdd : boolean = false;
  reg :boolean =false;
  constructor(private heroservice : HeroService, private router : Router) { }

 
  checkDate() {
    const dateSendingToServer = new DatePipe('en-US').transform(this.stockout.newdate, 'dd/MM/yyyy')
    this.stockout.date = dateSendingToServer
    console.log(dateSendingToServer);
  }
  
   
  somefunction(event : any){   
    this.heroservice.productonbarcode(event.target.value)
    .subscribe((data:any)=>{
     this.neprod =data     
     this.newItem.productname = data.productname
     this.newItem.categoryname = data.categoryname
  })
  }

  ngOnInit(): void {
    // this.heroservice.getattributes().subscribe((data: any) => {
    //   this.attributes = data;
    // })
  }
  // To add new item in array    
  AddItem() {
    this.myItems.push(
      this.newItem
    );
    this.newItem = {};
    this.productcount += this.newItem.qty;
    this.count += 1   
  }

  // When user selects edit option  
  EditItem(i: any) {
    this.reg=false;
    this.editIndex = i;
    this.IsForUpdate = true;
    this.newItem = {...this.myItems[i]};
    
  }

  // When user clicks on update button to submit updated value  
  UpdateItem() {
    this.productcount -= this.myItems[this.editIndex].qty;
  this.myItems[this.editIndex].productname=this.newItem.productname;
  this.myItems[this.editIndex].barcodeorqrcode=this.newItem.barcodeorqrcode;
  this.myItems[this.editIndex].categoryname=this.newItem.categoryname;
  this.myItems[this.editIndex].qty=this.newItem.qty;
  this.productcount += this.newItem.qty;

    this.IsForUpdate = false;
    this.newItem = {};
  }
  // To delete specific item  
  DeleteItem(i: any) {
    this.productcount -= this.myItems[i].qty
    this.count -= 1;    
    this.myItems.splice(i, 1);
  }
  
  
  addstockout(){
    this.stockout.totalStocksOut = this.productcount;
    this.stockout.totalProductsOut = this.count;
    this.heroservice.newstockout( this.stockout)    
    .subscribe((data:any) =>
      {console.log(data);
        if(data.error==false){
          alert("Stock Out Successfull")
        this.router.navigate(['/admindashboard/stockouthistory']);
        }
        else {
          alert("Stock Out Failed as "+data.message)
        this.router.navigate(['/admindashboard/stockouthistory']);
        }
      })   
  }

}
