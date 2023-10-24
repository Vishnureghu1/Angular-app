const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const admindataSchema = new Schema({ 
   
    firstname: String,
    lastname: String,
    email: String,
    password: String,  
    phonenumber:String,          
    creation_date: Date
});

//  fire a function before doc saved to db
admindataSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); 
  next();
});

var SignUpData = mongoose.model('admindata', admindataSchema);

module.exports = SignUpData;