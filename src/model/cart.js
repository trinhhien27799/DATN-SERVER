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

// product_name: { type: String, required: true },
// brand_name: { type: String, required: true },
// default_price: { type: Number, require: true },
// color_product: {
//     _id: { type: String, required: true },
//     color: { type: String, required: true },
//     image: { type: String, required: true },
//     increase_price: { type: Number, required: true },
// },
// ram_product: {
//     _id: { type: String, required: true },
//     size: { type: String, required: true },
//     increase_price: { type: Number, required: true },
// },
// rom_product: {
//     _id: { type: String, required: true },
//     size: { type: String, required: true },
//     increase_price: { type: Number, required: true },
// }


module.exports = mongoose.model('Cart', Cart) 