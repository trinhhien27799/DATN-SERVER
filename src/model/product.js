const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Product = new Schema({
    product_name: { type: String, require: true },
    brand_name: { type: String, require: true },
    percent_discount: { type: Number, default: 0 },
    image_preview: { type: String },
    vote: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    time: { type: Date, default: Date.now },
    product_type: { type: String, require: true, default: "Điện thoại" },
    min_price: { type: Number },
    max_price: { type: Number },
    total_quantity: { type: Number, require: true, default: 0 }
}, {
    collection: "Product"
});



module.exports = mongoose.model('Product', Product)