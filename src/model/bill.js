const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Bill = new Schema({
    username: { type: String, require: true },
    address: { type: Object, require: true },
    products: [{
        id_product: { type: String, required: true },
        name_product: { type: String, required: true },
        brand_product: { type: String, required: true },
        color_product: {
            color: { type: String },
            image: { type: String }
        },
        ram_product: { type: String },
        rom_product: { type: String },
        price_product: { type: Number, require: true }
    }],
    total_price: { type: Number, require: true },
    status: { type: Number, default: 0 },
    note: { type: String },
    time: { type: Date, default: Date.now }
}, {
    collection: "Bill"
})



module.exports = mongoose.model('Bill', Bill) 