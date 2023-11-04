const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Banner = new Schema({
    image: { type: String, require: true },
    title: { type: String, require: true },
    keyword: { type: String },
    time: { type: Date, default: Date.now }
}, {
    collection: "Banner"
})



module.exports = mongoose.model('Banner', Banner) 