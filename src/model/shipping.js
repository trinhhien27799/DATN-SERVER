const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Shipping = new Schema({
    name: { type: String, require: true, unique: true },
    price: { type: Number, require: true }
}, {
    collection: "Shipping"
})




module.exports = mongoose.model('Shipping', Shipping) 