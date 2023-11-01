const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Product = new Schema({
    product_name: { type: String, require: true },
    brand_name: { type: String, require: true },
    description: [{
        title: { type: String },
        content: { type: String },
        image: { type: String },
        productId: { type: String },
    }],
    default_price: { type: Number, require: true },
    max_price: { type: Number },
    percent_discount: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    image_preview: { type: String, require: true },
    vote: { type: Number, default: 0 },
    options: {
        colors: [{
            color: { type: String },
            increase_price: { type: Number, default: 0 },
            image: { type: String }
        }],
        roms: [{
            size: { type: String },
            increase_price: { type: Number, default: 0 }
        }],
        rams: [{
            size: { type: String },
            increase_price: { type: Number, default: 0 }
        }]
    },
    time: { type: Date, default: Date.now }
}, {
    collection: "Product"
});



module.exports = mongoose.model('Product', Product);