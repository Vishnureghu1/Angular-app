import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http : HttpClient) { }

  //api : string ='/api';
  
  api : string ="http://localhost:3000";   //for development


  getproducts(){
    return this.http.get(this.api+"/admin/allproducts");
  }
  getproduct(id:any){
    return this.http.post(this.api+"/admin/toeditproduct", {pId : id });
  }

  getcheckoutdetails(id:any){
    return this.http.post(this.api+"/admin/"+id, {checkoutId : id });
  }

  getproductsoncategory(categoryname:any){    
    return this.http.post(this.api+"/admin/getproductsoncategory", {categoryname:categoryname});
  }
  getinventoryoncategory(categoryname:any){    
    return this.http.post(this.api+"/admin/getinventoryoncategory", {categoryname:categoryname});
  }
  
  getcategories(){
    return this.http.get(this.api+"/admin/allcategories");
  } 
  newproduct(item : any){
    console.log("trfgggg")
    return this.http.post(this.api+"/admin/createproduct",item)
   
  }
  editProduct(product:any , pId: any)
  {
    console.log('client update')
    return this.http.post(this.api+"/admin/updateproduct",product , pId)
   
  }
  
  deleteProduct(id:any)
  {
    return this.http.post(this.api+"/admin/deleteproduct", {pId : id})
  }

  newcategory(item : any){
    console.log("trfgggg")
    return this.http.post(this.api+"/admin/createcategory",item)
   
  }

  getcategory(id:any){
    return this.http.post(this.api+"/admin/toeditcategory", {cId : id });
  }
  getattribute(id:any){
    return this.http.post(this.api+"/admin/toeditattribute", {aId : id });
  }
  editattribute(attribute:any , aId: any)
  {
    console.log('client update')
    return this.http.post(this.api+"/admin/updatecategory",attribute , aId)    
  }

  editcategory(category:any , cId: any)
  {
    console.log('client update')
    return this.http.post(this.api+"/admin/updatecategory",category , cId)    
  }

  deletecategory(id:any)
  {
    return this.http.post(this.api+"/admin/deletecategory", {cId : id})
  }

  getvendors(){
    return this.http.get(this.api+"/admin/allvendors");
  }
  getattributes(){
    return this.http.get(this.api+"/admin/allattributes");
  }
  newvendor(item : any){    
    return this.http.post(this.api+"/admin/createvendor",item)
   
  }

  getvendor(id:any){
    return this.http.post(this.api+"/admin/toeditvendor", {vId : id });
  }

  editvendor(vendor : any , vId: any){   
    return this.http.post(this.api+"/admin/updatevendor",vendor , vId)
    
  }

  deletevendor(id : any){
    return this.http.post(this.api+"/admin/deletevendor", {vId : id})
  }
  productonbarcode(barcodeorqrcode : any){
    return this.http.post(this.api+"/admin/findproductfrominventory", {barcodeorqrcode : barcodeorqrcode})
  }
  productonbarcodeproductdata(barcodeorqrcode : any){
    return this.http.post(this.api+"/admin/findproductfromproducts", {barcodeorqrcode : barcodeorqrcode})
  }

 newstockin( stockin : any){     
   return this.http.post(this.api+"/admin/stockIn" , stockin)
 }
 retailsale( stockin : any){     
  return this.http.post(this.api+"/admin/retailsale" , stockin)
}
 newstockout( stockout : any){   
   console.log(stockout);
     
  return this.http.post(this.api+"/admin/stockout" , stockout)
}

newreturn( returnout : any){   
  console.log(returnout);
    
 return this.http.post(this.api+"/admin/returnproduct" , returnout)
}

getstockouts(){
  return this.http.get(this.api+"/admin/stockouthistory");
}

getreturnhistory(){
  return this.http.get(this.api+"/admin/returnhistory");
}
 
getreturnhistorydaterange(daterange : any){
  console.log("reached");  
  console.log(daterange)
  return this.http.post(this.api+"/admin/returnhistorydaterange", daterange);
}
getstockouthistorydaterange(daterange : any){
  return this.http.post(this.api+"/admin/stockouthistorydaterange", daterange);
}
getstockins(){
  return this.http.get(this.api+"/admin/allproductsfrominventory");
}
getstatistics(){
  return this.http.get(this.api+"/admin/statistics");
}


  getToken()
  {    
    return localStorage.getItem('token')
  }

}
