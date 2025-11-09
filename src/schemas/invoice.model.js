const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema({
  invoice_code: { type: String, required: true },
  store_id: { type: String, required: true },
  user_id: String,
  customer: {
    name: String,
    phone: String,
  },
  zone_id: String,
  total_amount: Number,
  discount: Number,
  payment_method: { type: String, default: "cash" },
  status: { type: String, default: "completed" },
  products: [
    {
      product_id: String,
      name_product: String,
      quantity: Number,
      unit_price: Number,
      total_price: Number
    }
  ],
  date: { type: Date, default: Date.now }, // thời điểm thanh toán 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoices", invoiceSchema);
