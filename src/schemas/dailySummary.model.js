const mongoose = require("mongoose");
const { Schema } = mongoose;

const summarySchema = new Schema({
  date: { type: Date, required: true },
  store_id: { type: String, required: true },
  zone_id: { type: String },
  total_revenue: { type: Number, default: 0 },
  performance: {
    people_count: Number, // tổng số người
    total_invoices: Number, // tổng số hóa đơn
    total_sales_value: Number, // tổng giá trị bán hàng
    conversion_rate: Number, // tỷ lệ chuyển đổi
    avg_dwell_time: Number,
    top_product_id: String,
    peak_hour: Number, // giờ cao điểm
    total_stop_events: Number, // tổng số sự kiện dừng lại
    people_current: Number, // số người hiện tại trong cửa hàng
    checkoutLength: Number, // độ dài hàng đợi thanh toán
  },
  chart_data: {
    total_people_per_hours: {
      hour: Number,
      people_count: Number,
    },
    total_revewnue_per_hour: {
      hour: Number,
      revenue: Number,
    },
  },
  top_products: [
    {
      product_id: String,
      product_name: String,
      total_quantity: Number,
      total_revenue: Number,
      rank: Number,
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SummaryDaily", summarySchema , "summarydaily");
