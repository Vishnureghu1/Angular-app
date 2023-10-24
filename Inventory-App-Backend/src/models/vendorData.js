const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vendordataSchema = new Schema({ 
   
    vendor: String,
    line1: String,        
    line2: String,
    town:String, 
    postcode:String,
    phonenumber: String,
    emailid:String,
    country:String,
    contactperson:String,
    creation_date: Date
});


var vendordt = mongoose.model('vendordata', vendordataSchema);

module.exports = vendordt;