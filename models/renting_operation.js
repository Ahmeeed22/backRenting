const mongoose = require('mongoose')
const RentingOperation = mongoose.model('RentingOperation', {
    total_payment: {
        type: Number
    },
    total_days: {
        type: Number
    },
    start_date: {
        type: Date
    },
    position_receipt:{
        type:String
    },
    status_operation: {
        type: String,
        enum: ["requested", "shipping", "closed"],
        default: "requested"
    },
    seller:{
        type: mongoose.ObjectId
    },
    buyer:{
        type: mongoose.ObjectId
    },
    product: {
        type: mongoose.ObjectId
    }
})

module.exports = RentingOperation