const mongoose = require('../helpers/db_connection.js')
const express = require('express');
const Category = require('../models/category.js');
var multer = require('multer')
//get all user
const categoryRouter = express.Router();
categoryRouter.get('/all-category', (req, res, next) => {
    Category.find({}).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        return next(new Error(err))
    })
})
//add user
categoryRouter.post('/add-category',(req,res,next)=>{
    const data_inserted = req.body;
    Category.insertMany(data_inserted).then((result)=>{
        res.status(200).json({ 'success': "data is inserted" })
        console.log('success');
    }).catch(err=>{
        return next(new Error(err))
    })
});



module.exports = categoryRouter;