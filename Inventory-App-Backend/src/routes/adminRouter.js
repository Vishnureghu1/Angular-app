const express = require('express');
const productdt = require('../models/productData');
const returnproductdt = require('../models/returnproductData');
const categorydt = require('../models/categoryData');
const vendordt = require('../models/vendorData');
const stkindt = require('../models/stokinData');
const inventorydt = require('../models/inventoryData');
const stkoutdt = require('../models/stockoutData');
const expproductdt = require('../models/expproductData');
const attributedt = require('../models/attributeData');
const jwt = require('jsonwebtoken');
const adminData = require('../models/adminData');
const retailstockoutDt = require('../models/retailStockoutDt')
var displayMessage = require('../helpers/helpers');
const dailystockinData = require('../models/dailystockinData');
var errorclass = require('../helpers/exceptions')
const bcrypt = require('bcrypt');
const fs = require('fs')

const verify = require('../verifytoken/verifytoken');

let adminRouter = express.Router();

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

adminRouter.post('/login', async function (req, res) {

    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body)

    try {
        let user = await adminData.findOne({ 'email': email })
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


adminRouter.post('/createproduct', verify, cpUpload, async function (req, res) {
    console.log(req.files)
    if (req.files.Object == null) {
        console.log("hhh");
    }

    try {
        // dta = await categorydt.findById(req.body.cId)
        let product = {
            productname: req.body.productname,
            barcodeorqrcode: req.body.barcodeorqrcode,
            categoryname: req.body.categoryname,
            type: req.body.type,
            qtyInattribute:req.body.qtyInattribute,
            //   pricePerunit: req.body.pricePerunit,
            attribute: req.body.attribute,
            image: req.files.Object == null ? undefined : req.files?.image[0].path,
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

//full product list
adminRouter.post('/toeditproduct', verify, async function (req, res) {
    console.log(req.body)
    productdt.findById(req.body.pId)
        .then(function (events) {
            res.status(200).send(events)
        })

});

//full product list
adminRouter.post('/toeditcategory', verify, async function (req, res) {
    console.log(req.body)
    categorydt.findById(req.body.cId)
        .then(function (events) {
            res.status(200).send(events)
        })

});
adminRouter.post('/toeditattribute', verify, async function (req, res) {
    console.log(req.body)
    attributedt.findById(req.body.aId)
        .then(function (events) {
            res.status(200).send(events)
        })

});

adminRouter.post('/toeditvendor', verify, async function (req, res) {
    console.log(req.body)
    vendordt.findById(req.body.vId)
        .then(function (events) {
            res.status(200).send(events)
        })

});


adminRouter.post('/updateproduct', verify, cpUpload, async function (req, res) {
    console.log(req.body)

    let product = {
        productname: req.body.productname != null ? req.body.productname : undefined,
        barcodeorqrcode: req.body.barcodeorqrcode != null ? req.body.barcodeorqrcode : undefined,
        categoryname: req.body.categoryname != null ? req.body.categoryname : undefined,
        image: req.files.image != null ? req.files?.image[0].path : undefined,
        creation_date: new Date(),
    }
    let updateevent = { $set: product };
    await productdt.findByIdAndUpdate({ _id: req.body._id }, updateevent).then((data) => {
        console.log(data);
        if (req.files.image) {
            fs.unlinkSync(data.image);
        }
        res.status(200).json(displayMessage("product updated sucessfully", false));
    })
        .catch((error) => {
            console.log('Error found' + error);
            res.status(400).json(displayMessage("product update failed", true));
        })

});


//full product list
adminRouter.get('/allproducts', verify, async function (req, res) {
    productdt.find()
        .then(function (events) {
            events.sort((a, b) =>
                a.productname.localeCompare(b.productname)//using String.prototype.localCompare()
            );
            res.status(200).send(events)
        })

});

//Delete product data
adminRouter.post('/deleteproduct', verify, async (req, res) => {
    console.log(req.body);
    id = req.body.pId;
    try {
        console.log(` inside deleted ${id}`);
        await productdt.findOneAndDelete({ '_id': id }).then((indus) => {
            console.log(indus.image);
            fs.unlinkSync(indus.image);
            res.status(200).json(displayMessage("Product delted sucessfully", false))
        })
    }
    catch {
        res.status(404).json(displayMessage("product deletion failed", true))
    }

});

//create category route starts here
adminRouter.post('/createcategory', verify, cpUpload, async function (req, res) {
    console.log(req.body)

    try {
        let category = {
            categoryname: req.body.categoryname,
            qty: 0,
            image: req.files?.image[0].path,
            creation_date: new Date(),
        }
        //console.log(req.files.image[0].path);
        let newcategorydt = await categorydt(category);
        console.log(newcategorydt._id);
        await newcategorydt.save()
        res.status(200).json(displayMessage("Category added successfully with id " + newcategorydt._id, false))
    }
    catch (e) {
        console.log(e);
        res.status(404).json(displayMessage("Category adding failed ", true));
    }

});

adminRouter.post('/updatecategory', verify, cpUpload, async function (req, res) {
    console.log(req.body)

    let category = {
        categoryname: req.body.categoryname.length != 0 ? req.body.categoryname : undefined,
        image: req.files.image != null ? req.files?.image[0].path : undefined,
        creation_date: new Date(),
    }
    let updateevent = { $set: category };
    await categorydt.findByIdAndUpdate(req.body._id, updateevent).then((data) => {
        console.log(data)
        if (req.files.image) {
            fs.unlinkSync(data.image);
        }
        res.status(200).json(displayMessage("category updated sucessfully", false));
    })
        .catch((error) => {
            console.log('Error found' + error);
            res.status(400).json(displayMessage("category update failed", true));
        })
});

adminRouter.post('/deletecategory', verify, async (req, res) => {
    console.log(req.body);
    id = req.body.cId;
    try {
        console.log(` inside deleted ${id}`);
        let categorydelete = await categorydt.findOneAndDelete({ '_id': id })
        fs.unlinkSync(categorydelete.image);
        res.status(200).json(displayMessage("category delted sucessfully", false))
    }
    catch {
        res.status(400).json(displayMessage("category deletion failed", true))
    }

});

adminRouter.get('/allcategories', verify, async function (req, res) {
    categorydt.find()
        .then(function (categories) {
            categories.sort((a, b) =>
                a.categoryname.localeCompare(b.categoryname)//using String.prototype.localCompare()
            );
            res.status(200).json(categories);
        }).catch((error) => {
            res.status(404).json(displayMessage("Something went wrong", true));
        })
});

//create category route ends here

adminRouter.post('/returnproduct', verify, async function (req, res) {
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
            let returnproducts = {
                returnId: req.body.returnId,
                reason: req.body.reason,
                totalitemreturn: req.body.totalitemreturn,
                totalstockreturn: req.body.totalstockreturn,
                date: req.body.date,
                products: [],
                creation_date: new Date(),
            }
            var pdt = await inventorydt.find();
            for (i = 0; i < req.body.products.length; i++) {
                returnproducts.products[i] = {
                    productname: req.body.products[i].productname,
                    categoryname: req.body.products[i].categoryname,
                    barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                    qty: req.body.products[i].qty,
                    expDate: req.body.products[i].expDate ?? ""
                }

                flag = false;
                for (let j = 0; j < pdt.length; j++) {

                    if (pdt[j].barcodeorqrcode == req.body.products[i].barcodeorqrcode) {
                        console.log(pdt[j].qty);
                        console.log(req.body.products[i].qty);
                        newqty = pdt[j].qty - req.body.products[i].qty;
                        if (newqty < 0) {
                            flag = true;
                            failedProduct = req.body.products[i].productname;
                            console.log("jjjjjjjj");
                            break;
                        }
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
                    returnproducts.products[i] = {
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
                    let newreturnproducts = await returnproductdt(returnproducts);
                    console.log(newreturnproducts);
                    await newreturnproducts.save();
                    res.status(200).json(displayMessage("Product Returned Successfully", false));
                }
            }
        }
    }
    catch (e) {
        res.status(404).json(displayMessage("Failed to return products", true));
    }
})


//vendors display, adding updating deleting starts here

adminRouter.post('/createvendor', verify, async function (req, res) {
    console.log(req.body)

    try {
        let vendordetails = {
            vendor: req.body.vendor,
            line1: req.body.line1,
            line2: req.body.line2 ?? "",
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
        await newvendordetails.save()
        res.status(200).json(displayMessage("vendordetails added successfully", false));
    }
    catch (e) {
        res.status(404).json(displayMessage("vendordetails not added ", true));
    }

});
adminRouter.post('/deletevendor', verify, async (req, res) => {
    console.log(req.body);
    id = req.body.vId;
    try {
        console.log(` inside deleted ${id}`);
        await vendordt.findByIdAndDelete({ _id: id })
        res.status(200).json(displayMessage("vendors deleted sucessfully", false));
    }
    catch (e) {
        res.status(404).json(displayMessage("error in deleting vendor ", true));
    }

});
adminRouter.post('/updatevendor', verify, async (req, res) => {
    console.log(req.body);
    id = req.body._id;
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
        res.status(200).json(displayMessage("vendors updated sucessfully", false));
    })
        .catch((error) => {
            console.log('Error found');
            res.status(404).json(displayMessage("vendors update failed ", true))
        })
});

adminRouter.get('/allvendors', verify, async function (req, res) {
    try {
        var vdt = await vendordt.find();
        res.status(200).json(vdt)
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }
});
//vendors display adding updating deleting ends here

adminRouter.post('/retailsale', async function (req, res) {
    console.log(req.body);
    let totalqtyoutInAttribute = 0;
    let newqty = 0;
    let flag = false;
    let addingqtyinattribute=0;
    let stkin;    
    let totalqtyoutInAttributeall = 0;
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
                unknownproduct = parseInt(req.body.products[i].barcodeorqrcode);
                unknownproductname = req.body.products[i].productname;
            }
        }
        if (req.body.products.length != count) {
            res.status(400).json(displayMessage(unknownproductname + " with barcode (" + unknownproduct + ") is not found", true));
        }
        else {
            stkin = {
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
                expiryarray: [],
                creation_date: new Date(),
            }

            for (i = 0; i < req.body.products.length; i++) {
                stkin.products[i] = {
                    productname: req.body.products[i].productname,
                    categoryname: req.body.products[i].categoryname,
                    barcodeorqrcode: parseInt(req.body.products[i].barcodeorqrcode),
                    qty: req.body.products[i].qty,
                    expDate: req.body.products[i].expDate ?? ""
                }
                var pdt = await retailstockoutDt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode });
                flag = false;
                //  for (let j = 0; j < pdt.length; j++) {
                if (pdt == null) {
                    res.json({ message: "no product found" })
                }
                //if (pdt[j].barcodeorqrcode == req.body.products[i].barcodeorqrcode) {
                const productqauntity = await productdt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode })
                
                
                totalqtyoutInAttribute = parseFloat(req.body.products[i].qtyInAttribute) * parseFloat(req.body.products[i].qty);
                
                const productdet = await retailstockoutDt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode })
                if(totalqtyoutInAttribute>productqauntity.qtyInattribute){
                    newqty = pdt.newqty -  parseInt(totalqtyoutInAttribute / productqauntity.qtyInattribute);
                    addingqtyinattribute = parseInt(parseInt(productdet.addingqtyinattribute) + (totalqtyoutInAttribute % productqauntity.qtyInattribute));
                }
                else{
                addingqtyinattribute = parseInt(totalqtyoutInAttribute+parseInt(productdet.addingqtyinattribute)); 
                if(addingqtyinattribute==productqauntity.qtyInattribute)
                {
                    newqty = pdt.newqty - 1;
                    addingqtyinattribute=0;
                }
                else if(addingqtyinattribute>productqauntity.qtyInattribute)
                {
                    newqty = pdt.newqty - 1;
                    console.log("addingqtyinattribute",addingqtyinattribute);
                    console.log(productqauntity.qtyInattribute);
                    addingqtyinattribute = parseInt(parseInt(addingqtyinattribute) - productqauntity.qtyInattribute);
                }
                else{
                    newqty = pdt.newqty;
                }
            }
                console.log("productdet1=", totalqtyoutInAttribute);
                totalqtyoutInAttributeall = parseFloat(parseFloat(productdet.totalqtyoutInAttributeall) - totalqtyoutInAttribute);
                if (totalqtyoutInAttributeall < 0) {
                    console.log("11111222"); 
                    flag = true;
                    failedProduct = req.body.products[i].productname;
                    break;
                }
                console.log("NEW QUANTITY: " + newqty);
                console.log("Reached");
            }
            // }

        }
        if (flag) {
            console.log("222222");
            res.json(displayMessage("Insufficient Stock on " + failedProduct, true));
        }
        else {
            for (i = 0; i < req.body.products.length; i++) {
                stkin.products[i] = {
                    productname: req.body.products[i].productname,
                    categoryname: req.body.products[i].categoryname,
                    barcodeorqrcode: parseInt(req.body.products[i].barcodeorqrcode),
                    qty: req.body.products[i].qty,
                    // expDate: req.body.products[i].expDate ?? ""
                }

                var pdt = await retailstockoutDt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode });
                flag = false;
                //  for (let j = 0; j < pdt.length; j++) {

                if (pdt.barcodeorqrcode == parseInt(req.body.products[i].barcodeorqrcode)) {
                    // totalqtyoutInAttribute = parseFloat(req.body.products[i].qtyInAttribute) * parseFloat(req.body.products[i].qty);
                    // const productdet = await retailstockoutDt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode })
                    // console.log("productdet1=", totalqtyoutInAttribute);
                    // totalqtyoutInAttributeall = parseFloat(parseFloat(productdet.totalqtyoutInAttributeall) - totalqtyoutInAttribute);

                    let resultdata = await retailstockoutDt.updateOne({
                        barcodeorqrcode: req.body.products[i].barcodeorqrcode
                    }, {
                        $set: {
                            newqty: newqty,
                            totalqtyoutInAttributeall: totalqtyoutInAttributeall,
                            addingqtyinattribute:addingqtyinattribute

                        }
                    }, { upsert: true }
                    );
                    //  await resultdata.save();                            

                }
                // }
                if (flag) break;

            }
            if (!flag) {
                let newstkin = await stkoutdt(stkin);
                console.log("llll", newstkin);
                await newstkin.save()
                res.status(200).json(displayMessage("Stocks checkedout sucessfully", false));
            }
        }
    }

    catch (e) {
        console.log(e);
        res.status(404).json(displayMessage("Stocks failed to checkout", true));
    }

})

adminRouter.get('/stockinhistory', verify, async function (req, res) {
    try {
        var allstockin = await stkindt.find();
        res.status(200).json({ message: "Fetched all stockin under the category Successfully", error: false, Allstockin: allstockin })
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong", true));
    }
})

adminRouter.post('/stockout', async function (req, res) {
    console.log(req.body);
    let totalqtyoutInAttribute = 0;
    let totalqtyoutInAttributeall = 0;
    let failedProduct;
    let newqty = 0;
    let fl=false;
    let producttoupdate;
    let unknownproduct;
    let unknownproductname;
    let count = 0;
    let attribute ;
    let qauntityinattribute ;
    try {
        for (i = 0; i < req.body.products.length; i++) {
            const qtyinattributefromproductDt = await productdt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode });
            if(!qtyinattributefromproductDt.qtyInattribute){
                fl=true;
                producttoupdate=req.body.products[i].productname;
                break
            }
            }
            if(fl){
                res.json({message:"product with product name "+producttoupdate+" need to be updated with quantity in ml or grams"})
            }
        for (i = 0; i < req.body.products.length; i++) {
            proddt = await productdt.find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode });
            if (proddt.length > 0) {
                count++
            }
            else {
                unknownproduct = parseInt(req.body.products[i].barcodeorqrcode);
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
                expiryarray: [],
                creation_date: new Date(),
            }

            for (i = 0; i < req.body.products.length; i++) {
                stkin.products[i] = {
                    productname: req.body.products[i].productname,
                    categoryname: req.body.products[i].categoryname,
                    barcodeorqrcode: parseInt(req.body.products[i].barcodeorqrcode),
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
                        barcodeorqrcode: parseInt(req.body.products[i].barcodeorqrcode),
                        qty: req.body.products[i].qty,
                        expDate: req.body.products[i].expDate ?? ""
                    }
                    try {
                        let expproductdata = await expproductdt
                            .find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode }).sort({ expdateformated: 1 })
                        console.log("gggg=", expproductdata);
                        let updatedqty = req.body.products[i].qty;
                        // let stkin.arr:[];           
                        console.log("jj=", updatedqty);
                        for (y = 0; y < expproductdata.length; y++) {
                            if (expproductdata[y].qty <= updatedqty) {
                                let respdata = await expproductdt
                                    .deleteOne({ _id: expproductdata[y]._id })
                                console.log(respdata);
                                if (updatedqty > 0)
                                    updatedqty = updatedqty - expproductdata[y].qty;
                                console.log("jj=", updatedqty);
                                stkin.expiryarray[y] = { "exp": expproductdata[y].expDate, "qty": expproductdata[y].qty, "productname": expproductdata[y].productname, "barcodeorqrcode": expproductdata[y].barcodeorqrcode, "categoryname": expproductdata[y].categoryname, }
                            }
                            else {
                                if (updatedqty > 0) {
                                    newoneqty = expproductdata[y].qty - updatedqty;
                                    console.log("updated", updatedqty);
                                    console.log("newoneqty", newoneqty);
                                    let respdata = await expproductdt
                                        .updateOne({ _id: expproductdata[y]._id }, { $set: { qty: newoneqty } })
                                    console.log(respdata);
                                    stkin.expiryarray[y] = { "exp": expproductdata[y].expDate, "qty": updatedqty, "productname": expproductdata[y].productname, "barcodeorqrcode": expproductdata[y].barcodeorqrcode, "categoryname": expproductdata[y].categoryname }
                                    updatedqty = 0;
                                }
                                console.log("jj=", updatedqty);

                            }
                        }
                        console.log("kkk=", stkin.arr);
                        // res.send({mess:"succ",arr})
                        // await expproductdata.save()
                    }
                    catch (e) {
                        console.log("error=", e);
                    }
                    var pdt = await inventorydt.find();
                    flag = false;
                    for (let j = 0; j < pdt.length; j++) {

                        if (pdt[j].barcodeorqrcode == parseInt(req.body.products[i].barcodeorqrcode)) {
                            const qtyinattributefromproductDt = await productdt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode });
                            if (qtyinattributefromproductDt.qtyInattribute
) {
                                attribute = qtyinattributefromproductDt.attribute;
                                qauntityinattribute = qtyinattributefromproductDt.qtyInattribute

                            }
                            else {
                                res.json({ message: "Update product details with quantinty in ml or grams" })
                                return;
                            }
                            totalqtyoutInAttribute = parseFloat(qauntityinattribute) * parseFloat(req.body.products[i].qty);
                            const productdet = await retailstockoutDt.findOne({ barcodeorqrcode: req.body.products[i].barcodeorqrcode })
                           let updatedqty=0;
                            console.log("productdet1=", totalqtyoutInAttribute);
                            if (productdet) {
                                console.log("productdet=", productdet);
                                updatedqty= parseInt(parseInt(productdet.newqty) + req.body.products[i].qty);
                                totalqtyoutInAttributeall = parseFloat(parseFloat(productdet.totalqtyoutInAttributeall) + totalqtyoutInAttribute);
                            }
                            else {
                                updatedqty= parseInt(productdet.newqty);
                                totalqtyoutInAttributeall = parseFloat(totalqtyoutInAttribute);
                            }

                            let resultdata = await retailstockoutDt.updateOne({
                                barcodeorqrcode: req.body.products[i].barcodeorqrcode
                            }, {
                                $set: {
                                    attribute: req.body.products[i].attribute,
                                    productname: req.body.products[i].productname,
                                    newqty: updatedqty,
                                    totalqtyoutInAttributeall: totalqtyoutInAttributeall,
                                    barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                                    categoryname: req.body.products[i].categoryname
                                }
                            }, { upsert: true }
                            );
                            //  await resultdata.save();
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
                        totalqtyOutAttribute = parseInt(req.body.products[i].qty * req.body.products[i].qtyOutAttribute);
                        console.log("req.body.products[i].qty=" + req.body.products[i].qty);

                        await categorydt.findOneAndUpdate({ categoryname: req.body.products[i].categoryname },
                            { $set: { qty: calculatedQty } }).then((data) => {
                                console.log(data)
                            })
                    }


                }
                if (!flag) {
                    let newstkin = await stkoutdt(stkin);
                    console.log("llll", newstkin);
                    await newstkin.save()
                    res.status(200).json(displayMessage("Stocks checkedout sucessfully", false));
                }
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json(displayMessage("Stocks failed to checkout", true));
    }

})

adminRouter.get('/stockouthistory', async function (req, res) {
    try {
        var allstockin = await stkoutdt.find();
        allstockin.reverse();
        res.status(200).json(allstockin);
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})

adminRouter.get('/returnhistory', verify, async function (req, res) {
    try {
        var allstockin = await returnproductdt.find();
        allstockin.reverse();
        res.status(200).json(allstockin)
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})

adminRouter.post('/returnhistorydaterange', verify, async function (req, res) {
    console.log(req.body);
    startdate = new Date(req.body.startdate).toISOString();
    enddate = new Date(req.body.enddate).toISOString();
    console.log(startdate);
    console.log(enddate);
    try {
        var allstockin = await returnproductdt.find({ "$and": [{ creation_date: { $gte: startdate } }, { creation_date: { $lte: enddate } }] });
        console.log(allstockin);
        res.status(200).json(allstockin)
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})

adminRouter.post('/stockouthistorydaterange', verify, async function (req, res) {
    console.log(req.body);
    startdate = new Date(req.body.startdate).toISOString();
    enddate = new Date(req.body.enddate).toISOString();
    console.log(startdate);
    console.log(enddate);
    try {
        var allstockin = await stkoutdt.find({ "$and": [{ creation_date: { $gte: startdate } }, { creation_date: { $lte: enddate } }] });
        console.log(allstockin);
        res.status(200).json(allstockin)
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})

adminRouter.post('/findproductfrominventory', verify, async function (req, res) {
    console.log("hhhhh")
    try {
        var filteredproduct = await inventorydt.find({ barcodeorqrcode: req.body.barcodeorqrcode });
        if (filteredproduct.length == 0) {
            res.status(404).json(displayMessage("product not found", true));
        }
        else {
            console.log(filteredproduct[0]);
            res.status(200).json(filteredproduct[0])
        }
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})

adminRouter.post('/findproductfromproducts', verify, async function (req, res) {

    try {
        var filteredproduct = await productdt.find({ barcodeorqrcode: req.body.barcodeorqrcode });
        if (filteredproduct.length == 0) {
            res.status(404).json(displayMessage("product not found", true));
        }
        else {
            console.log(filteredproduct[0]);
            res.status(200).json(filteredproduct[0])
        }
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})

adminRouter.post('/getproductsoncategory', verify, async function (req, res) {
    console.log(req.body);

    try {
        var filteredproduct = await productdt.find({ categoryname: req.body.categoryname });
        res.status(200).json(filteredproduct)
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})

adminRouter.post('/getinventoryoncategory', verify, async function (req, res) {
    console.log(req.body);

    try {
        var filteredproduct = await inventorydt.find({ categoryname: req.body.categoryname });
        res.status(200).json(filteredproduct)
    }
    catch (e) {
        res.status(404).json(displayMessage("somethingwent wrong ", true));
    }
})
adminRouter.post('/stockIn', async function (req, res) {
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
                            { $set: { qty: newqty } }).then((data) => {
                                //console.log(data)
                            })
                    }
                }
                if (flag == false) {
                    newqty = parseInt(req.body.products[i].qty);
                  //  totalqtymlall = parseInt(qty*qtyml);
                    let productimage = await productdt.find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode })
                    inventorydetails = {
                        productname: req.body.products[i].productname,
                        categoryname: req.body.products[i].categoryname,
                        barcodeorqrcode: req.body.products[i].barcodeorqrcode,
                        qty: parseInt(req.body.products[i].qty),
                        qtyml: parseInt(req.body.products[i].qtyml),
                    //    totalqtyml:totalqtyml,
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
            res.status(200).json(displayMessage("StockIn sucess",false));
        }
    }

    catch (e) {
        console.log(e);
        res.status(404).json(displayMessage("StockIn failed", true));
    }


});
//full product list
adminRouter.get('/allproductsfrominventory', verify, async function (req, res) {
    console.log("inventory");
    inventorydt.find()
        .then(function (events) {
            events.sort((a, b) =>
                a.productname.localeCompare(b.productname));//using String.prototype.localCompare()
            res.status(200).send(events)
        })

});

adminRouter.get('/statistics', verify, async function (req, res) {
    Totalquantity = 0;
    try {
        var categorydetails = await categorydt.find();
        for (let item of categorydetails) {
            Totalquantity = Totalquantity + item.qty;
        }
        console.log("Totalquantity = " + Totalquantity);
        res.status(200).json(Totalquantity)
    }
    catch (e) {
        res.status(404).json(displayMessage("Something went wrong", true));
    }
})

// adminRouter.post('/sortdate', async function (req, res) {
//     for (i = 0; i < req.body.products.length; i++) {
//         let stkin= {
//             productname: req.body.products[i].productname,
//             categoryname: req.body.products[i].categoryname,
//             barcodeorqrcode: req.body.products[i].barcodeorqrcode,
//             qty: req.body.products[i].qty,
//             expDate: req.body.products[i].expDate ?? ""
//         }
//         console.log("stk=",stkin);
//         try {
//             let expproductdata = await expproductdt
//                 .find({ barcodeorqrcode: req.body.products[i].barcodeorqrcode }).sort({ expdateformated: 1 })
//             console.log("gggg=", expproductdata);
//             let updatedqty = req.body.products[i].qty;
//             let arr=[];           
//             console.log("jj=",updatedqty);
//             for(y=0;y<expproductdata.length;y++){                
//                 if(expproductdata[y].qty<=updatedqty){
//                     let respdata = await expproductdt
//                     .deleteOne({_id:expproductdata[y]._id})
//                     console.log(respdata);
//                     if(updatedqty>0)
//                     updatedqty=updatedqty-expproductdata[y].qty;
//                     console.log("jj=",updatedqty);
//                     arr[y]={"exp":expproductdata[y].expDate,"qty":expproductdata[y].qty,"productname":expproductdata[y].productname,"barcodeorqrcode":expproductdata[y].barcodeorqrcode}
//                 }
//                 else{
//                     if(updatedqty>0){
//                     newoneqty=expproductdata[y].qty-updatedqty;
//                     console.log("updated",updatedqty);
//                     console.log("newoneqty",newoneqty);
//                     let respdata = await expproductdt
//                     .updateOne({_id:expproductdata[y]._id},{$set : {qty:newoneqty}})
//                     console.log(respdata);                    
//                     arr[y]={"exp":expproductdata[y].expDate,"qty":updatedqty,"productname":expproductdata[y].productname,"barcodeorqrcode":expproductdata[y].barcodeorqrcode}
//                     updatedqty=0;
//                 }
//                     console.log("jj=",updatedqty);                    

//                 }              
//             }
//             console.log("kkk=",arr);
//             res.send({mess:"succ",arr})
//             // await expproductdata.save()
//         }
//         catch (e) {
//             console.log("error=", e);
//         }
//     }
// })

// adminRouter.post('/adddate', async function (req, res) {
//     for (i = 0; i < req.body.products.length; i++) {
//         console.log("ulv");
//         datefor = req.body.products[i].expdateyymmdd       
//         console.log("datefor", datefor);
//         let expproduct = {
//             productname: req.body.products[i].productname,
//             categoryname: req.body.products[i].categoryname,
//             barcodeorqrcode: req.body.products[i].barcodeorqrcode,
//             qty: req.body.products[i].qty,
//             expDate: req.body.products[i].expDate,
//             expdateformated: datefor
//         }
//         try {
//             let expproductdata = await expproductdt(expproduct);
//             console.log("gggg=", expproductdata);
//             await expproductdata.save()
//         }
//         catch (e) {
//             console.log("error=", e);
//         }
//     }
//     res.send({ mess: "added sucess" })
// });
adminRouter.post('/addattribute', async function (req, res) {

    try {
        // dta = await categorydt.findById(req.body.cId)
        let attribute = {
            attribute: req.body.attribute,
            creation_date: new Date(),
        }
        let newproduct = await attributedt(attribute);
        console.log(newproduct);
        await newproduct.save()
        res.status(200).json(displayMessage("Attribute created sucessfully and aId is " + newproduct._id, false));
    }
    catch (e) {
        res.status(400).json(displayMessage("creating attribute failed", true));
    }
});
adminRouter.get('/allattributes', async function (req, res) {
    attributedt.find()
        .then(function (attributes) {
            attributes.sort((a, b) =>
                a.attribute.localeCompare(b.attribute)//using String.prototype.localCompare()
            );
            res.status(200).json(attributes);
        }).catch((error) => {
            console.log(error);
            res.status(404).json(displayMessage("Something went wrong", true));
        })
});
adminRouter.post('/:id', async function (req, res) {
    console.log(req.params.id)
    if (req.body.checkoutId.length == 24) {
        stkoutdt.findById(req.body.checkoutId)
            .then(function (events) {
                console.log(events);
                res.status(200).send(events)
            })
    }
    else {
        res.status(200).send({ message: " In this case checkout Id is objectId itself" })
    }

});

module.exports = adminRouter;