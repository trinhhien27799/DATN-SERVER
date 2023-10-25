const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Banner = new Schema({
    image: { type: String, require: true },
    brand:{ type: String},
    content:[{
        title:{type:String},
        content:{type:String},
        image:{type:String},
        productId:{type:String},
    }]
}, {
    collection: "Banner"
})



module.exports = mongoose.model('Banner', Banner) 