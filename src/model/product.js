const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    product_name: { type: String, require: true },
    brand_name: { type: String, require: true },
    price: { type: Number, require: true },
    percent_discount: { type: Number },
    rom: { type: String },
    ram: { type: String },
    colors: [{
        color: { type: String },
        quantity_color: { type: Number},
        image: { type: String },
    }],
    description: [
      {
        title: { type: String },
        content: { type: String },
        image: { type: String },
        productId: { type: String },
      },
    ],
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    vote: { type: Number, default: 0 },
    time: { type: Date, default: Date.now },
  },
  {
    collection: "Product",
  }
);

module.exports = mongoose.model("Product", Product);
