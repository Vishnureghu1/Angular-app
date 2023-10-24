const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productdataSchema = new Schema({ 
   
    attribute: String,         
    creation_date: Date
});


var attributeData = mongoose.model('attributedata', productdataSchema);

module.exports = attributeData;