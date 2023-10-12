const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Product = new Schema({
    product_name: { type: String, require: true },
    brand_name: { type: String, require: true },
    description: { type: String },
    default_price: { type: Number, require: true },
    image_preview: { type: String, require: true },
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
    }
}, {
    collection: "Product"
});



module.exports = mongoose.model('Product', Product);