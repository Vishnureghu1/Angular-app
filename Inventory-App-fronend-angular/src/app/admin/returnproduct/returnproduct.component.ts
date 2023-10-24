import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-returnproduct',
  templateUrl: './returnproduct.component.html',
  styleUrls: ['./returnproduct.component.css']
})
export class ReturnproductComponent implements OnInit {

  productcount : any=0;
  count : any =0;
  randomnumber = Math.floor(100000 + Math.random() * 900000);
  

  categories: any = [];
  // Array where we are going to do CRUD operations    
  myItems: any = [];

  ghtu(){
    console.log(this.return.reason);
    
  }
  
  // Other variables   

  IsForUpdate: boolean = false;
  newItem: any = {};
  updatedItem: any;
  editIndex: number = -1;
  vendors: any = [];
  neprod: any = [];
  isforAdd: boolean = false

  return: any = {
    returnId: this.randomnumber,    
    products: this.myItems,

  };

  constructor(private heroservice: HeroService, private router: Router) { }

  ngOnInit(): void {    
   
  }
  checkDate() {
    const dateSendingToServer = new DatePipe('en-US').transform(this.return.newdate, 'dd/MM/yyyy')
    this.return.date = dateSendingToServer
    console.log(dateSendingToServer);
  }


  somefunction(event: any) {
    this.heroservice.productonbarcode(event.target.value)
      .subscribe((data: any) => {
        this.neprod = data
        this.newItem.productname = data.productname
        this.newItem.categoryname = data.categoryname
      })
  }

  // To add new item in array    
  AddItem() {
    this.myItems.push(
      this.newItem
    );
    this.productcount += this.newItem.qty;
    this.count += 1
    console.log(this.newItem);
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
    console.log(this.productcount);
    this.IsForUpdate = false;
    this.newItem = {};
  }
  // To delete specific item  
  DeleteItem(i: any) {
    this.productcount -= this.myItems[i].qty
    this.count -= 1;
    this.myItems.splice(i, 1);
  }


  addreturn() {
    this.return.totalstockreturn=this.productcount;
    this.return.totalitemreturn=this.count;
    this.heroservice.newreturn(this.return)
      .subscribe((data:any) => {
        console.log(data);
        if(data.error==false){
          alert("Return Sucessfull")
        }
        else{
          alert("Return failed")
        }
        this.router.navigate(['/admindashboard/returnhistory']);
      })
  }

}
