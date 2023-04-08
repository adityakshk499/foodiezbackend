const mongoose = require('mongoose')
const {Schema} = mongoose


const foodItems = new Schema({
    CategoryName:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    options:{
        type:[],
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{collection: 'foodItems'})

module.exports  = mongoose.model('foodItems',foodItems)