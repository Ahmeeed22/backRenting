const mongoose = require('../helpers/db_connection.js')
const express = require('express');
const User = require('../models/users.js');
var multer = require('multer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { upload, uploadPhoto } = require('../helpers/upload-user.js')
//get all user
const userRouter = express.Router();
userRouter.get('/all-user', (req, res, next) => {
    User.find({}).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        return next(new Error(err))
    })
})
//add user
userRouter.post('/add-user', (req,res,next)=>{
    console.log(req.body);
    bcrypt.genSalt(saltRounds, (err, salt) =>{
        bcrypt.hash(req.body.Password, salt,(err, hash) =>{
            if(err){
                next(new Error('error in encryption password'))
            }
            req.body.Password = hash
            new User(req.body).save().then(()=>{
                console.log('data is registered')
                res.status(200).json({"status":'data is registered'})
            }).catch((err)=>{
                next(new Error('DATA NOT SAVED'))
            })
        });
    });
});
//update user record by id
userRouter.put('/update-user/:id', (req, res, next) => {
    let dataInserted = req.body;
    let id = req.params.id;
    User.findByIdAndUpdate(id, dataInserted).then(() => {
        res.status(200).json({ 'success': "data is Updated" })
    }).catch((err) => {
        return next(new Error(err))
    })
})
//delete user by id
userRouter.delete('/delete-user/:id', (req, res, next) => {
    let id = req.params.id
    User.findByIdAndDelete(id).then(() => {
        res.status(200).json({ 'success': "data is deleted" })
    }).catch((err) => {
        return next(new Error(err))
    })
}) 
userRouter.post('/login', (req, res, next) => {
    User.findOne({ Email: req.body.Email }).then((user) => {
        const resultCompare = bcrypt.compare(req.body.Password, user.Password).then((result) => {
            console.log(result)
            if (result == true) {
                const token = jwt.sign({ "id": user._id }, "baselkey")
                res.status(200).json({ "message": 'success', "token": token,"role_name":user.Role_name ,"data":user})
            } else {
                res.status(200).json({ "message": 'failed' })
            }

        });
    }).catch((err) => {
        next(new Error('error in return data from db'))
    })
});

userRouter.get('/get-user/:id', (req, res, next) => {
    let id = req.params.id;
    User.findOne({_id:id}).then(data => {
        res.status(200).json(data)
    }).catch((err) => {
        return next(new Error(err))
    })
})

module.exports = userRouter;