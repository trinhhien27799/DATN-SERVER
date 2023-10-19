const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Bill = new Schema({
    username: { type: String, require: true },
    address: { type: Object, require: true },
    products: [{
        id_product: { type: String, required: true },
        product_name: { type: String, required: true },
        brand_name: { type: String, required: true },
        color_product: { type: String },
        image_product: { type: String, required: true },
        ram_product: { type: String },
        rom_product: { type: String },
        price_product: { type: Number, require: true },
        quantity: { type: Number, default: 1, required: true }
    }],
    total_price: { type: Number, require: true },
    status: { type: Number, default: 0 },
    note: { type: String },
    time: { type: Date, default: Date.now },
    cancel_order: { type: String }
}, {
    collection: "Bill"
})



module.exports = mongoose.model('Bill', Bill) 