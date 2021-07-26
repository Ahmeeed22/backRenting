const express = require('express');
const Product = require('../models/product.js');
const User = require('../models/users.js');
const RentingOperation = require('../models/renting_operation.js');
const RentingRouter = express.Router();

RentingRouter.post('/add-renting',async(req,res,next)=>{
        RentingOperation.insertMany(req.body).then((data) => {
          res.status(200).json({ 'message': 'product is inserted' })
        }).catch((err) => {
            return next(new Error(err))
        })
})
RentingRouter.get('/all-renting',(req,res,next)=>{
    RentingOperation.find({}).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        return next(new Error(err))
    })
})

//update renting record by id
RentingRouter.put('/update-renting/:id', (req, res, next) => {
    let dataInserted = req.body;
    let id = req.params.id;
    RentingOperation.findByIdAndUpdate(id, dataInserted).then(() => {
        res.status(200).json({ 'success': "data is Updated" })
    }).catch((err) => {
        return next(new Error(err))
    })
})
//delete renting by id
RentingRouter.delete('/delete-renting/:id', (req, res, next) => {
    let id = req.params.id
    RentingOperation.findByIdAndDelete(id).then(() => {
        res.status(200).json({ 'success': "data is deleted" })
    }).catch((err) => {
        return next(new Error(err))
    })
})

RentingRouter.get('/get-product-from-rentingcollection/', async (req, res, next) => {
    const renting = await RentingOperation.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productData'
            }
        }
    ]).exec((err, result) => {
        if (err) {
            return next(new Error(err))
        }
        if (result) {
            res.status(200).json(result)
        }
    });
})
RentingRouter.get('/get-user-from-rentingcollection/', async (req, res, next) => {
    const renting = await RentingOperation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userData'
            }
        }
    ]).exec((err, result) => {
        if (err) {
            return next(new Error(err))
        }
        if (result) {
            res.status(200).json(result)
        }
    });
})
RentingRouter.get('/search-by-user-email/:email', async (req, res, next) => {
    const Email = req.params.email;
    const renting = await RentingOperation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userData'
            }
        }
    ]).exec((err, result) => {
        if (err) {
            return next(new Error(err))
        }
        if (result) {
            const arry_user = [];
            const data =   result.map((item)=>{
               const Email_user = item.userData[0].Email;
                if(Email_user==Email){
                    arry_user.push(item)
                }else{
                    if (err) {
                        return next(new Error(err))
                    } 
                }
            })
            res.status(200).json(arry_user)
            res.end();
        }
    });
})

module.exports = RentingRouter;
