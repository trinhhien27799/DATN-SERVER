const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Cart = new Schema({
    username: { type: String, require: true },
    product_id: { type: String, required: true },
    color_id: { type: String, required: true },
    ram_id: { type: String},
    rom_id: { type: String },
    quantity: { type: Number, default: 1, required: true },
}, {
    collection: "Cart"
})



module.exports = mongoose.model('Cart', Cart) 