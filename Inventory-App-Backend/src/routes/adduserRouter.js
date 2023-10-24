const express = require('express');
const addUser = require('../models/adminData');
const userData = require('../models/userData');
var displayMessage = require('../helpers/helpers');

const jwt = require('jsonwebtoken');


let adduserRouter = express.Router();


adduserRouter.post('/', async function (req, res) {
    console.log(req.body)

    try {
        let existuser = await addUser.findOne({ 'email': req.body.email })
        if (existuser == null) {
            let user = {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: req.body.password,
                creation_date: new Date(), 
            }
            console.log("b4" + user.firstname);
            let newuser = await userData(user); 
            let usernewuser = await addUser(user);
            console.log(newuser);
            await newuser.save();
            await usernewuser.save() ;            
            res.status(200).json(displayMessage("Registered sucessfully",false))
        }
        else {
            res.status(400).json(displayMessage("email already exists",true));

        }
    }
    catch (e){
        res.status(400).json(displayMessage("something went wrong",true));
    }

});

//full user list
adduserRouter.get('/allusers', async function (req, res) {
    userData.find()
        .then(function (events) {
            res.send(events)
        })

});
adduserRouter.get('/allusersadmin', async function (req, res) {
    addUser.find()
        .then(function (events) {
            res.send(events)
        })

});

//Delete user data
adduserRouter.post('/deleteuser', async (req, res) => {
    console.log(req.body);
    id = req.body._id
    console.log(` inside deleted ${id}`);
    await userData.findOneAndDelete({ '_id': id },
        (err, result) => {
            if (err) {
                res.send(false)
            } else {
                res.send(true)
            }
        });
});



module.exports = adduserRouter;