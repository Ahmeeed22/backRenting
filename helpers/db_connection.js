const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://renterific:root@cluster0.ihfc1.mongodb.net/renterific?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false }).
then(()=>{
    console.log('success connection')
}).catch((error)=>{
    console.log('error connection')
})
mongoose.set('useFindAndModify', false);
module.exports = mongoose

