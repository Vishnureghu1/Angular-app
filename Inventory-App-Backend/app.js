const express = require('express');
const app = express();

const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const mongoose = require('mongoose');
require('dotenv/config');
var displayMessage = require('./src/helpers/helpers');

const port = process.env.PORT || 3000;

const catdatafordisplay = require('./src/models/categoryData')


app.use(express.urlencoded({ extended: true })); //middleware portion for adding data
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

mongoose.connect('', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(data => {
    console.log("data base connected");
  });
  
//adduser starts here
const adduserRouter = require('./src/routes/adduserRouter');
app.use('/adduser', adduserRouter);
//adduser ends here

//admin starts here
const adminRouter = require('./src/routes/adminRouter');
app.use('/admin', adminRouter);
//admin ends here


//user starts here
const userRouter = require('./src/routes/userRouter');
app.use('/user', userRouter);
//user ends here

//404 error Handling starts here
app.get('*', function (req, res) {
  res.status(404).json(displayMessage("Route not found", true));
})

app.post('*', function (req, res) {
  res.status(404).json(displayMessage("Route not found", true));
})
//404 error Handling ends here


//ejs starts here
app.get('/', function (req, res) {    
  res.render('index');
});
app.get('/updateproduct', function (req, res) {
  res.render('updateprodusts');
});
app.get('/category', function (req, res) {
  res.render('category');
});
app.get('/displayimage', function (req, res) {
  
  catdatafordisplay.find().then(function (books) {
    console.log(books)
    res.render('displayimage',       
    {books}   
    );
});
})
//ejs ends here


// port listening to starts here//
app.listen(port, () => {
  console.log("Server ready at" + port);
});
// port listening to ends here//


