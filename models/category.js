const mongoose = require('mongoose')
const Category = mongoose.model('Category', {
    title: {
        type: String,
        unique: true,
        index: true
    },
    decs: {
        type: String
    }
})

module.exports = Category