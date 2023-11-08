const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Favorite = new Schema({
    username: { type: String, require: true },
    product_id: { type: String, require: true }
}, {
    collection: "Favorite"
})



module.exports = mongoose.model('Favorite', Favorite) 