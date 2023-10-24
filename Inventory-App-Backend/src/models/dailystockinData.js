const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expproddataSchema = new Schema({ 
   
    productname: String,
    barcodeorqrcode: Number,
    categoryname:String,
   // attribute:String,
    qty : Number,
   // qtyInAttribute:Number,
  //  totalqtyInAttribute:Number,
    //totalqtyInAttributeall:Number,
    categoryname: String,
    expDate: String,   
    date:String
         
});


var dailystkinData = mongoose.model('dailyStockInData', expproddataSchema);

module.exports = dailystkinData;