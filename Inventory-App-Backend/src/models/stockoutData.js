const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stkindataSchema = new Schema({ 
   
    checkoutId: Number,
    date: String,
    user: Object,
    totalProductsOut: Number,
    totalStocksOut: Number,   
    products:Array,     
    expiryarray:Array,
    creation_date: Date
});
var stkinDt = mongoose.model('stockoutData', stkindataSchema);

module.exports = stkinDt;