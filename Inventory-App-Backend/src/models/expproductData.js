const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expproddataSchema = new Schema({ 
   
    productname: String,
    barcodeorqrcode: Number,
    qty : Number,
    categoryname: String,
    qtyml:Number,
    totalqtymlIn:Number,
    expDate: String,        
    expdateformated:String       
});


var expprodData = mongoose.model('expproddata', expproddataSchema);

module.exports = expprodData;