const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Favorite = new Schema({
    username: { type: String, require: true },
    list_id_product: [{ type: String }]
}, {
    collection: "Favorite"
})



module.exports = mongoose.model('Favorite', Favorite) 