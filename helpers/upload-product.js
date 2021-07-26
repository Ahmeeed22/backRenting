var multer = require('multer')
const mongoose = require('./db_connection.js')
const Product = require('../models/product.js');
const Category = require('../models/category.js');
const User = require('../models/users.js');
const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images/products');
  },
  filename: (req, file, callback) => {
    console.log(file)
    const ext = file.mimetype.split('/')[1];
    callback(null, file.originalname);
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
exports.upload = async (req, res, next) => {
  if (!req.file) {
    console.log('Something Went Wrong');
  }
  try {
    const cat_title =  req.headers.cattitle;
    const user_email =  req.headers.useremail;
    const cat = await Category.findOne({ title: cat_title });//cars   cat_id ----inserty pro   user re
    const user = await User.findOne({ Email: user_email })//email     user_id
    const dataInserted =
    {
      title: req.body.title,
      image: req.body.image,
      desc: req.body.desc,
      price_by_day: parseInt(req.body.price_by_day),
      category:cat._id,
      user:user._id
    }
    console.log(dataInserted)

    Product.insertMany(dataInserted).then((data) => {
      res.status(200).json({ 'message': 'product is inserted' })
    }).catch((err) => {
        return next(new Error(err))
    })
  }
  catch (error) {
    return next(new Error(err))
  }
}
exports.uploadPhoto = upload.single('photo');