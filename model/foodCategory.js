const mongoose = require('mongoose')
const {Schema} = mongoose


const foodCategory = new Schema({
    categoryName:{
        type:String,
        required:true
    }
    
},{collection: 'foodCategory'})

module.exports  = mongoose.model('foodCategory',foodCategory)