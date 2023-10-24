import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-retailsale',
  templateUrl: './retailsale.component.html',
  styleUrls: ['./retailsale.component.css']
})
export class RetailsaleComponent implements OnInit {

  productcount : any=0;
  count : any =0;
  randomnumber = Math.floor(100000 + Math.random() * 900000);
  // Used To Specify Title using Interpolation  

  title = 'Working With Array In Angular 5';

  categories: any = [];
  // Array where we are going to do CRUD operations    
  myItems: any = [];

  stockin: any = {
    Invoiceno: this.randomnumber,
    user: {
      fname : 'Admin',
      lname: 'User',
      email :'testemail@example.com'
    },
    products: this.myItems
  };
  // Other variables   

  IsForUpdate: boolean = false;
  newItem: any = {};
  updatedItem: any;
  editIndex: number = -1;
  vendors: any = [];
  attributes:any=[];
  neprod: any = [];
  isforAdd: boolean = false

  constructor(private heroservice: HeroService, private router : Router) {

  }

  checkDate() {
    const dateSendingToServer = new DatePipe('en-US').transform(this.stockin.newdate, 'dd/MM/yyyy')
    this.stockin.date = dateSendingToServer
    console.log(dateSendingToServer);
  }
  checkexpDate(){
    console.log("selected date=",this.newItem.expdate);  
    this.newItem.expdateyymmdd =this.newItem.expdate;
    const expdateSendingToServer = new DatePipe('en-US').transform(this.newItem.expdate, 'dd/MM/yyyy')
    this.newItem.expDate = expdateSendingToServer
   console.log(expdateSendingToServer);
    console.log(this.newItem.expdateyymmdd);        
  }


  somefunction(event: any) {
    this.heroservice.productonbarcodeproductdata(event.target.value)
      .subscribe((data: any) => {
        this.neprod = data
        this.newItem.productname = data.productname
        this.newItem.categoryname = data.categoryname
      })
  }

  ngOnInit(): void {
    this.heroservice.getcategories().subscribe((data: any) => {
      this.categories = data;
    })
    this.heroservice.getvendors().subscribe((data: any) => {
      this.vendors = data;
    })
    this.heroservice.getattributes().subscribe((data: any) => {
      this.attributes = data;
    })
  }
  // To add new item in array    
  AddItem() {
    this.myItems.push(
      this.newItem
    );
    this.productcount += this.newItem.qty;
    this.count += 1
    this.newItem = {};

  }

  // When user selects edit option  
  EditItem(i: any) {
    this.editIndex = i;
    this.IsForUpdate = true;
    this.newItem = { ...this.myItems[i] };

  }

  // When user clicks on update button to submit updated value  
  UpdateItem() {
    this.productcount -= this.myItems[this.editIndex].qty;
    this.myItems[this.editIndex].productname = this.newItem.productname;
    this.myItems[this.editIndex].barcodeorqrcode = this.newItem.barcodeorqrcode;
    this.myItems[this.editIndex].categoryname = this.newItem.categoryname;
    this.myItems[this.editIndex].qty = this.newItem.qty;
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
  Item() {
    console.log(this.myItems);
  }


  addstockin() {
    this.stockin.totalStocksIn = this.productcount;
    this.stockin.totalProductsIn = this.count;
    this.heroservice.retailsale(this.stockin)
      .subscribe((data:any) => {
        console.log(data);
        if(data.error==false){
        alert("Retai sale Successfull")
        }
        else{
        alert("Stock Out Failed as "+data.message)
        }
        this.router.navigate(['/admindashboard']);
      })
  }


}
