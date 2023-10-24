const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const userdataSchema = new Schema({ 
   
    fname: String,
    lname: String,
    email: String,
    password: String,  
    phonenumber:String,        
    creation_date: Date
});

//  fire a function before doc saved to db
userdataSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); 
  next();
});

var userSignUpData = mongoose.model('userdata', userdataSchema);

module.exports = userSignUpData;