const mongoose = require('mongoose')
const Product = mongoose.model('Product', {
    title: {
        type: String
    },
    image: {
        type: String
    },
    desc: {
        type: String
    },
    price_by_day: {
        type: Number
    },
    status_adminstaration: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    status: {
        type: String,
        enum: ["unavailable", "available"],
        default: "available"
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.ObjectId,
        ref: 'User'
    }
})

module.exports = Product