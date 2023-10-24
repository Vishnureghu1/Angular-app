const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorydataSchema = new Schema({ 
   
    categoryname: String, 
    image:String,
    qty:Number,   
    creation_date: Date
});


var categoryData = mongoose.model('category', categorydataSchema);

module.exports = categoryData;