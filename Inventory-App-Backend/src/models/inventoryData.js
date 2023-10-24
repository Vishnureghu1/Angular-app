const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventorydataSchema = new Schema({ 
   
    productname: String,
    barcodeorqrcode: Number,
    qty : Number,
    categoryname: String,
    expDate: String, 
    image:String,         
    creation_date: Date
});


var inventoryData = mongoose.model('inventorydata', inventorydataSchema);

module.exports = inventoryData;