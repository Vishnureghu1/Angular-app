const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expproddataSchema = new Schema({ 
   
    productname: String,
    barcodeorqrcode: Number,
    categoryname:String,
    attribute:String,
    newqty : Number,
    qtyInAttribute:Number,
    totalqtyInAttribute:Number,
    totalqtyoutInAttributeall:String,
    addingqtyinattribute:String,
    categoryname: String,    
    date:String
         
});


var retailstockoutData = mongoose.model('retailstockout', expproddataSchema);

module.exports = retailstockoutData;