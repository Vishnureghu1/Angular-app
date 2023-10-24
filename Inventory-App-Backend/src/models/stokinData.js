const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stkindataSchema = new Schema({

    Invoiceno: String,
    date: String,
    user: Object,
    vendor: String,
    line1: String,
    line2: String,
    town: String,
    postcode: String,
    phonenumber: String,
    emailid: String,
    country: String,
    contactperson: String,
    totalProductsIn: Number,
    totalStocksIn: Number,
    products: Array,
    creation_date: Date
});
var stkinDt = mongoose.model('stockinData', stkindataSchema);

module.exports = stkinDt;