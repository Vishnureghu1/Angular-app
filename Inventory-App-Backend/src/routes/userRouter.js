const express = require('express');
const userdt = require('../models/userData');
const categorydt = require('../models/categoryData');
const productdt = require('../models/productData');
const vendordt = require('../models/vendorData');
const stkindt = require('../models/stokinData');
const stkoutdt = require('../models/stockoutData');
const inventorydt = require('../models/inventoryData');
const expproductdt = require('../models/expproductData');
var displayMessage = require('../helpers/helpers');
var errorclass = require('../helpers/exceptions');
const verify = require('../verifytoken/verifytoken');
const dailystockinData = require('../models/dailystockinData')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//const verify=require('../verifytoken/verifytoken');

let userRouter = express.Router();
userRouter.get('/', async function (req, res) {
    res.json("enter to user router")
})

/* multer start */
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${+Date.now()}.${file.originalname.split('.')[1]}`
        );
    }
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 }
]);
/* multer end */

userRouter.post('/login', async function (req, res) {
    console.log(req.body)
    let email = req.body.email;
    let password = req.body.password;

    try {
        let user = await userdt.findOne({ 'email': email })
        if (user == null) throw errorclass.userNotfound;
        let status = await bcrypt.compare(password, user.password);
        console.log(status);
        if (!status) throw errorclass.invalidCredentials;
        let payload = { subject: user.email, add: user.add, delete: user.delete, edit: user.edit, superadmin: user.superadmin }
        console.log("payload=" + payload.subject)
        let token = jwt.sign(payload, 'secretKey')
        console.log("token=" + token)
        res.status(200).json({ message: "User Logged Successfully", error: false, token: token, fname: user.fname, lname: user.lname, email: user.email, phonenumber: user.phonenumber ?? '' })

    } catch (error) {
        console.log(error);
        if (error === errorclass.userNotfound) {
            res.status(404).json(displayMessage(error.message, true));
        }
        else if (error === errorclass.invalidCredentials) {
            res.status(404).json(displayMessage(error.message, true));
        }
        else {
            res.status(500).json((displayMessage("Something went Wrong or Invalid Request", true)))
        }
    }

});

//categories display starts here

userRouter.get('/allcategories', async function (req, res) {
    categorydt.find()
        .then(function (categories) {
            res.status(200).json({ message: "Fetched all categories Successfully", error: false, categories: categories });
        }).catch((error) => {
            res.status(404).json(displayMessage("Something went wrong", true));
        })
})
//categories display ends here
userRouter.post('/createproduct', cpUpload, async function (req, res) {
    console.log(req.files)

    try {
        dta = await categorydt.findById(req.body.cId)
        let product = {
            productname: req.body.productname,
            barcodeorqrcode: req.body.barcodeorqrcode,
            categoryname: dta.categoryname,
            image: req.files != null ? req.files?.image[0].path : undefined,
            creation_date: new Date(),
        }
        let newproduct = await productdt(product);
        console.log(newproduct);
        await newproduct.save()
        res.status(200).json(displayMessage("product created sucessfully and pId is " + newproduct._id, false));
    }
    catch (e) {
        res.status(400).json(displayMessage("creating product failed", true));
    }

});

//Product acccording to category display starts here
userRouter.post('/categoryproducts', async function (req, res) {
    try {
        var dt = await categorydt.findById(req.body.cId);
        console.log(dt);
        if (dt == null) throw errorclass.invalidcId;
        console.log(dt.categoryname);
        var products = await inventorydt.find({ "categoryname": dt.categoryname });
        res.status(200).json({ message: "Fetched all products under the category Successfully", error: false, products: products });

    }
    catch (e) {
        if (e instanceof TypeError) {
            res.status(400).json(displayMessage("Invalid Request", true));
        } else if (e === errorclass.invalidcId) {
            res.status(400).json(displayMessage(errorclass.invalidcId.message, true));
        }
    }
})
//Product acccording to category display ends here

//vendors display, adding updating deleting starts here

userRouter.post('/createvendor', async function (req, res) {
    console.log(req.body)

    try {
        let vendordetails = {
            vendor: req.body.vendor,
            line1: req.body.line1,
            line2: req.body.line2,
            town: req.body.town,
            postcode: req.body.postcode,
            phonenumber: req.body.phonenumber,
            emailid: req.body.emailid,
            country: req.body.country,
            contactperson: req.body.contactperson,
            creation_date: new Date(),
        }
        let newvendordetails = await vendordt(vendordetails);
        console.log(newvendordetails);
        await newvendordetails.save();
        res.status(200).json(displayMessage("Vendor added successfully", false));
    }
    catch (e) {
        res.status(404).json(displayMessage("Failed to create vendor" + e, true));
    }

});
userRouter.post('/deletevendor', async (req, res) => {
    console.log(req.body);
    id = req.body.vId;
    try {
        console.log(` inside deleted ${id}`);
        await vendordt.findByIdAndDelete({ _id: id })
        res.status(200).json(displayMessage("Vendor deleted sucessfully", false));
    }
    catch (e) {
        res.status(404).json(displayMessage("Unable to delete vendor ", true));
    }

});
userRouter.post('/updatevendor', async (req, res) => {
    console.log(req.body);
    id = req.body.vId;
    let item = {
        vendor: req.body.vendor,
        line1: req.body.line1,
        line2: req.body.line2,
        town: req.body.town,
        postcode: req.body.postcode,
        phonenumber: req.body.phonenumber,
        emailid: req.body.emailid,
        country: req.body.country,
        contactperson: req.body.contactperson,
    }
    console.log(item)
    let updateevent = { $set: item };
    await vendordt.findByIdAndUpdate({ _id: id }, updateevent).then((data) => {
        console.log(data)
        res.status(200).json(displayMessage("Vendor updated sucessfully", false));
    })
        .catch((error) => {
            res.status(404).json(displayMessage("Vendor update failed ", true))
        })
});

userRouter.get('/allvendors', async function (req, res) {
    try {
        var vdt = await vendordt.find();
        res.status(200).json({ message: "Fetched all vendors Successfully", error: false, vendors: vdt })
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }
});
//vendors display adding updating deleting ends here

userRouter.post('/stockIn', async function (req, res) {
    let newqty = 0;
    let totalqtymlall=0;
    arrayproduct = [];
    console.log("req.body=",req.body);
    let unknownproduct;
    let unknownproductname;
    let count = 0;
    try {
        for (i = 0; i < req.body.products.length; i++) {
            proddt = await productdt.find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode });
            if (proddt.length > 0) {
                count++
            }
            else {
                unknownproduct = req.body.products[i].barcodeorqrcode;
                unknownproductname = req.body.products[i].productname;
            }
        }
        if (req.body.products.length != count) {
            res.status(400).json(displayMessage(unknownproductname + " with barcode (" + unknownproduct + ") is not found", true));
        }
        else {
            let vendordetails = req.body.vId != null ? await vendordt.findById(req.body.vId) : undefined;
            console.lovendordetails != null;

            let stkin = {
                Invoiceno: req.body.Invoiceno,
                date: req.body.date,
                user: {
                    fname: req.body.user.fname,
                    lname: req.body.user.lname,
                    email: req.body.user.email,
                    phonenumber: req.body.user.phonenumber ?? ""
                },
                vendor: vendordetails != null ? vendordetails.vendor : undefined,
                line1: vendordetails != null ? vendordetails.line1 : undefined,
                line2: vendordetails != null ? vendordetails.line2 : undefined,
                town: vendordetails != null ? vendordetails.town : undefined,
                postcode: vendordetails != null ? vendordetails.postcode : undefined,
                phonenumber: vendordetails != null ? vendordetails.phonenumber : undefined,
                emailid: vendordetails != null ? vendordetails.emailid : undefined,
                country: vendordetails != null ? vendordetails.country : undefined,
                contactperson: vendordetails != null ? vendordetails.contactperson : undefined,
                totalProductsIn: req.body.totalProductsIn,
                totalStocksIn: req.body.totalStocksIn,
                products: [],
                creation_date: new Date(),
            }
            for (i = 0; i < req.body.products.length; i++) {
                stkin.products[i] = {
                    productname: req.body.products[i].productname,
                    categoryname: req.body.products[i].categoryname,
                    barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                    qty: req.body.products[i].qty,
                    qtyml:req.body.products[i].qtyml,
                    totalqtymlIn: parseInt(req.body.products[i].qty*req.body.products[i].qtyml),
                    expDate: req.body.products[i].expDate ?? null
                }
                let arrayproduct = stkin.products[i];
                arrayproduct.date = req.body.date;               
                console.log("hhh", req.body.products[i].expDate);
                if (req.body.products[i].expDate != null || req.body.products[i].expDate!="") {
                    console.log("ulv");
                    datefor = req.body.products[i].expdateyymmdd;

                    let expproduct = {
                        productname: req.body.products[i].productname,
                        categoryname: req.body.products[i].categoryname,
                        barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                        qty: req.body.products[i].qty,
                        qtyml:req.body.products[i].qtyml,
                        totalqtymlIn: parseInt(req.body.products[i].qty*req.body.products[i].qtyml),
                        date:req.body.date,
                        expDate: req.body.products[i].expDate,
                        expdateformated: datefor
                    }
                    try {
                        let expproductdata = await expproductdt(expproduct);
                        console.log("gggg=", expproductdata);
                        await expproductdata.save()
                    }
                    catch (e) {
                        console.log("error=", e);
                    }
                }

                var pdt = await inventorydt.find();
                flag = false;
                for (let j = 0; j < pdt.length; j++) {

                    if (pdt[j].barcodeorqrcode == req.body.products[i].barcodeorqrcode) {
                        flag = true;
                        newqty = parseInt(req.body.products[i].qty) + parseInt(pdt[j].qty);
                        console.log("newqty =" + newqty)
                        totalqtymlall = parseInt(newqty*req.body.products[i].qtyml)
                        await inventorydt.findByIdAndUpdate({ _id: pdt[j]._id },
                            { $set: { qty: newqty ,totalqtyml:totalqtyml} }).then((data) => {
                                //console.log(data)
                            })
                    }
                }
                if (flag == false) {
                    newqty = parseInt(req.body.products[i].qty);
                    totalqtymlall = parseInt(qty*qtyml);
                    let productimage = await productdt.find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode })
                    inventorydetails = {
                        productname: req.body.products[i].productname,
                        categoryname: req.body.products[i].categoryname,
                        barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                        qty: parseInt(req.body.products[i].qty),
                        qtyml: parseInt(req.body.products[i].qtyml),
                        totalqtyml:totalqtyml,
                        expDate: req.body.products[i].expDate ?? "",
                        image: productimage[0].image
                    }
                    let newinventorydetails = await inventorydt(inventorydetails);                   
                    await newinventorydetails.save();
                }
                arrayproduct.qty=newqty;
                arrayproduct.totalqtymlall = totalqtymlall;
                let resultdata = await dailystockinData(arrayproduct);
                await resultdata.save();
                let searchedcategory = await categorydt.find({ categoryname: req.body.products[i].categoryname });
                console.log("searchedcategory", searchedcategory);
                for (let item of searchedcategory) {
                    let calculatedQty = (parseInt(item.qty ?? 0) + parseInt(req.body.products[i].qty));
                    console.log(item.qty);
                    console.log("sss=" + item);
                    console.log("sssrrrr=" + calculatedQty);
                    console.log("req.body.products[i].qty=" + req.body.products[i].qty);

                    await categorydt.findOneAndUpdate({ categoryname: req.body.products[i].categoryname },
                        { $set: { qty: calculatedQty } }).then((data) => {
                            console.log(data)
                        })
                }
            }
            let newstkin = await stkindt(stkin);
            console.log(newstkin);
            await newstkin.save()
            res.status(200).json(displayMessage("StockIn sucess"));
        }
    }

    catch (e) {
        console.log(e);
        res.status(404).json(displayMessage("StockIn failed", true));
    }


});

userRouter.get('/stockinhistory', async function (req, res) {
    try {
        var allstockin = await stkindt.find();
        res.status(200).json({ message: "Fetched all stockin under the category Successfully", error: false, Stockinhistory: allstockin })
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong", true));
    }
})

userRouter.post('/stockout', async function (req, res) {
    let failedProduct;
    let unknownproduct;
    let unknownproductname;
    let count = 0;
    try {

        for (i = 0; i < req.body.products.length; i++) {
            proddt = await productdt.find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode });
            if (proddt.length > 0) {
                count++
            }
            else {
                unknownproduct = req.body.products[i].barcodeorqrcode;
                unknownproductname = req.body.products[i].productname;
            }
        }
        if (req.body.products.length != count) {
            res.status(400).json(displayMessage(unknownproductname + " with barcode (" + unknownproduct + ") is not found", true));
        }
        else {
            let stkin = {
                checkoutId: req.body.checkoutId,
                date: req.body.date,
                user: {
                    fname: req.body.user.fname,
                    lname: req.body.user.lname,
                    email: req.body.user.email,
                    phonenumber: req.body.user.phonenumber ?? ""
                },
                totalProductsOut: req.body.totalProductsOut,
                totalStocksOut: req.body.totalStocksOut,
                products: [],
                expiryarray:[],
                creation_date: new Date(),
            }

            for (i = 0; i < req.body.products.length; i++) {
                stkin.products[i] = {
                    productname: req.body.products[i].productname,
                    categoryname: req.body.products[i].categoryname,
                    barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                    qty: req.body.products[i].qty,
                    expDate: req.body.products[i].expDate ?? ""
                }
                var pdt = await inventorydt.find();
                flag = false;
                for (let j = 0; j < pdt.length; j++) {

                    if (pdt[j].barcodeorqrcode == req.body.products[i].barcodeorqrcode) {
                        newqty = pdt[j].qty - req.body.products[i].qty;
                        if (newqty < 0) {
                            flag = true;
                            failedProduct = req.body.products[i].productname;
                            break;
                        }
                        console.log("NEW QUANTITY: " + newqty);
                        console.log("Reached");
                    }
                }
                if (flag) {
                    break;
                }
            }
            if (flag) {
                res.status(400).json(displayMessage("Insufficient Stock on " + failedProduct, true));
            }
            else {
                for (i = 0; i < req.body.products.length; i++) {
                    stkin.products[i] = {
                        productname: req.body.products[i].productname,
                        categoryname: req.body.products[i].categoryname,
                        barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                        qty: req.body.products[i].qty,
                        expDate: req.body.products[i].expDate ?? ""
                    }
                    try {
                        let expproductdata = await expproductdt
                            .find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode }).sort({ expdateformated: 1 })
                        console.log("gggg=", expproductdata);
                        let updatedqty = req.body.products[i].qty;
                       // let stkin.arr:[];           
                        console.log("jj=",updatedqty);
                        for(y=0;y<expproductdata.length;y++){                
                            if(expproductdata[y].qty<=updatedqty){
                                let respdata = await expproductdt
                                .deleteOne({_id:expproductdata[y]._id})
                                console.log(respdata);
                                if(updatedqty>0)
                                updatedqty=updatedqty-expproductdata[y].qty;
                                console.log("jj=",updatedqty);
                                stkin.expiryarray[y]={"exp":expproductdata[y].expDate,"qty":expproductdata[y].qty,"productname":expproductdata[y].productname,"barcodeorqrcode":expproductdata[y].barcodeorqrcode,"categoryname":expproductdata[y].categoryname,}
                            }
                            else{
                                if(updatedqty>0){
                                newoneqty=expproductdata[y].qty-updatedqty;
                                console.log("updated",updatedqty);
                                console.log("newoneqty",newoneqty);
                                let respdata = await expproductdt
                                .updateOne({_id:expproductdata[y]._id},{$set : {qty:newoneqty}})
                                console.log(respdata);                    
                                stkin.expiryarray[y]={"exp":expproductdata[y].expDate,"qty":updatedqty,"productname":expproductdata[y].productname,"barcodeorqrcode":expproductdata[y].barcodeorqrcode,"categoryname":expproductdata[y].categoryname}
                                updatedqty=0;
                            }
                                console.log("jj=",updatedqty);                    
                                
                            }              
                        }
                        console.log("kkk=",stkin.arr);
                       // res.send({mess:"succ",arr})
                        // await expproductdata.save()
                    }
                    catch (e) {
                        console.log("error=", e);
                    }
                    var pdt = await inventorydt.find();
                    flag = false;
                    for (let j = 0; j < pdt.length; j++) {

                        if (pdt[j].barcodeorqrcode == req.body.products[i].barcodeorqrcode) {
                            newqty = pdt[j].qty - req.body.products[i].qty;
                            if (newqty < 0) {
                                flag = true;
                                failedProduct = req.body.products[i].productname;
                                break;
                            }
                            console.log("NEW QUANTITY: " + newqty);
                            console.log("Reached");
                            //console.log("id=" + pdt[j]._id);
                            //console.log("new qty=" + newqty);
                            await inventorydt.findByIdAndUpdate({ _id: pdt[j]._id },
                                { $set: { qty: newqty } }).then((data) => {
                                    //console.log(data)
                                })

                        }
                    }
                    if (flag) break;
                    let searchedcategory = await categorydt.find({ categoryname: req.body.products[i].categoryname });
                    for (let item of searchedcategory) {
                        let calculatedQty = (parseInt(item.qty) - parseInt(req.body.products[i].qty));
                        console.log(item.qty);
                        console.log("sss=" + item);
                        console.log("sssrrrr=" + calculatedQty);
                        console.log("req.body.products[i].qty=" + req.body.products[i].qty);

                        await categorydt.findOneAndUpdate({ categoryname: req.body.products[i].categoryname },
                            { $set: { qty: calculatedQty } }).then((data) => {
                                console.log(data)
                            })
                    }


                }
                if (!flag) {
                    let newstkin = await stkoutdt(stkin);
                    console.log(newstkin);
                    await newstkin.save()
                    res.status(200).json(displayMessage("Stocks checkedout sucessfully", false));
                }
            }
        }
    }
    catch (e) {
        res.status(404).json(displayMessage("Stocks failed to checkout", true));
    }

})

userRouter.get('/stockouthistory', async function (req, res) {
    try {
        var allstockin = await stkoutdt.find();
        res.status(200).json({ message: "Fetched all stockout Successfully", error: false, Stockouthistory: allstockin })
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }
})


//allproducts from inventory db display starts here

userRouter.get('/allproducts', async function (req, res) {
    try {
        var allproductsdt = await inventorydt.find();
        res.status(200).json({ message: "Fetched all products Successfully", error: false, products: allproductsdt });
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }

});
//allproducts from inventory db display ends here

userRouter.post('/findproduct', verify, async function (req, res) {
    try {
        var filteredproduct = await productdt.find({ barcodeorqrcode: req.body.barcodeorqrcode });
        if (filteredproduct.length == 0) {
            res.status(404).json(displayMessage("Product not found", true));
        }
        else {
            res.status(200).json({ message: "Searched product is found Successfully", error: false, product: filteredproduct[0] })
        }
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }
})

userRouter.post('/findproductfrominventory', verify, async function (req, res) {
    try {
        var filteredproduct = await inventorydt.find({ barcodeorqrcode: req.body.barcodeorqrcode });
        if (filteredproduct.length == 0) {
            res.status(404).json(displayMessage("Product not found", true));
        }
        else {
            res.status(200).json({ message: "Searched product is found Successfully", error: false, product: filteredproduct[0] })
        }
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }
})

userRouter.get('/statistics', verify, async function (req, res) {
    Totalquantity = 0;
    try {
        var categorydetails = await categorydt.find();
        for (let item of categorydetails) {
            Totalquantity = Totalquantity + item.qty;
        }
        console.log("Totalquantity = " + Totalquantity);
        res.status(200).json({ message: "statistics found Successfully", error: false, statistics: Totalquantity })
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }
})

module.exports = userRouter;