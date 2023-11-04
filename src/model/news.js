const mongoose = require('mongoose')
const Schema = mongoose.Schema



const News = new Schema({
    image: { type: String, require: true },
    brand: { type: String },
    content: [{
        title: { type: String },
        content: { type: String },
        image: { type: String },
        productId: { type: String },
    }],
    time: { type: Date, default: Date.now }
}, {
    collection: "Banner"
})



module.exports = mongoose.model('News', News) 