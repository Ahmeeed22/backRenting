const express = require('express');
const Product = require('../models/product.js');
const { upload, uploadPhoto } = require('../helpers/upload-product.js')
//get all user
const productRouter = express.Router();
productRouter.get('/all-product', (req, res, next) => {
    Product.find({}).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        return next(new Error(err))
    })
})
//add user
productRouter.post('/add-product', uploadPhoto, upload);
//update user record by id
productRouter.put('/update-product/:id', (req, res, next) => {
    let dataInserted = req.body;
    let id = req.params.id;
    Product.findByIdAndUpdate(id, dataInserted).then(() => {
        res.status(200).json({ 'success': "data is Updated" })
    }).catch((err) => {
        return next(new Error(err))
    })
})
//delete user by id
productRouter.delete('/delete-product/:id', (req, res, next) => {
    let id = req.params.id
    Product.findByIdAndDelete(id).then(() => {
        res.status(200).json({ 'success': "data is deleted" })
    }).catch((err) => {
        return next(new Error(err))
    })
})

productRouter.get('/get-category-from-productcollection/', async (req, res, next) => {
    const product = await Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryData'
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
productRouter.get('/get-user-from-productcollection/', async (req, res, next) => {
    const product = await Product.aggregate([
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
productRouter.get('/search-by-category-title/:title', async (req, res, next) => {
    const title = req.params.title;
    const product = await Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryData'
            }
        }
    ]).exec((err, result) => {
        if (err) {
            return next(new Error(err))
        }
        if (result) {
            const arry_cat = [];
            const data =   result.map((item)=>{
               const cat_title = item.categoryData[0].title;
                if(cat_title==title){
                    arry_cat.push(item)
                }else{
                    if (err) {
                        return next(new Error(err))
                    } 
                }
            })
            res.status(200).json(arry_cat)
            res.end();
        }
    });
})
productRouter.get('/search-by-user-email/:email', async (req, res, next) => {
    const Email = req.params.email;
    
    const product = await Product.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userData'
            }
        }
    ]).exec((err, result) => {
        let arry_user = [];
        if (err) {
            return next(new Error(err))
        }
        if (result) {
            
            const data =   result.map((item)=>{
               const Email_user = item.userData[0].Email;
                if(Email_user==Email){
                    console.log(item)
                    arry_user.push(item)
                }
            })
            res.status(200).json(arry_user)
            res.end();
        }
    });
})

productRouter.get('/get-product/:id', (req, res, next) => {
    let id = req.params.id
    Product.findById(id).then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        return next(new Error(err))
    })
})


module.exports = productRouter;




 