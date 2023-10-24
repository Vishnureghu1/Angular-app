const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const returnproductdataSchema = new Schema({ 
    returnId:Number,
    reason: String,
    totalitemreturn: String,
    totalstockreturn: String,
    date: String,     
    products:Array,     
    creation_date: Date
});


var rtproductData = mongoose.model('returnproductdata', returnproductdataSchema);

module.exports = rtproductData;