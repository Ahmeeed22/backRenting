const mongoose = require('mongoose')
const User = mongoose.model('User', {
    Name: {
        type: String
    },
    Phone: {
        type: Number
    },
    Email: {
        type: String,
        unique: true,
        index: true
    },
    Password: {
        type: String
    },
    Address_street: {
        type:String
    },
    Address_city: {
        type:String
    },
    Role_name:{
        type:String,
        default: 'user'
    }
})

module.exports = User