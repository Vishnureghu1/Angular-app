const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productdataSchema = new Schema({ 
   
    productname: String,
    barcodeorqrcode: Number,
    categoryname: String,
    type:String,
    qtyInattribute:Number,
    pricePerunit:String,
    attribute:String,
    image: String,          
    creation_date: Date
});


var productData = mongoose.model('productdata', productdataSchema);

module.exports = productData;