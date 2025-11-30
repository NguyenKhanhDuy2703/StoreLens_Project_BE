const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema({
  invoice_code: { type: String, required: true },
  store_id: { type: String, required: true },
  total_amount: Number,
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

module.exports = mongoose.model("invoices", invoiceSchema);
