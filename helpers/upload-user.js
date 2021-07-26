var multer  = require('multer')
const mongoose = require('./db_connection.js')
const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/images/users');
    },
    filename: (req, file, callback) => {
        console.log(file)
      const ext = file.mimetype.split('/')[1];
      callback(null,file.originalname);
    },
  });
  
  const onlyImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
      callback(null, true);
    } else {
      callback(new Error('Only Jpeg Allowed'));
    }
  };
  
  const upload = multer({
    storage: multerConfig,
    fileFilter: onlyImage,
  });
  exports.upload = (req, res,next) => {
    if (!req.file) {
      console.log('Something Went Wrong');
    }
    try {
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
    }
    catch (error) {
        return next(new Error(err))
    }
  };
  
  exports.uploadPhoto = upload.single('photo');