const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  product_id: { type: String, required: true  , unique: true },
  category_name: { type: String, required: true },
  name_product: { type: String, required: true },
  store_id: { type: String, required: true },
  brand: String,
  price: { type: Number, required: true },
  unit: { type: String, default: "piece" },
  stock_quantity: Number,
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const productModel =  mongoose.model("Products", productSchema , "products");
module.exports = productModel
