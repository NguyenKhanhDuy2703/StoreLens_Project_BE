const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeSummarySchema = new Schema(
  {
    date: { type: Date, required: true, index: true },    // Ngày tổng hợp
    store_id: { type: String, required: true, index: true }, // ID của cửa hàng
    // ===== Dữ liệu KPI Tổng quan (Cập nhật hàng giờ hoặc cuối ngày) =====
    kpis: {
      total_visitors: { type: Number, default: 0 },   // Tổng khách vào cửa hàng
      total_revenue: { type: Number, default: 0 },    // Tổng doanh thu toàn cửa hàng
      total_invoices: { type: Number, default: 0 },  // Tổng số hóa đơn
      conversion_rate: { type: Number, default: 0 },  // Tỷ lệ chuyển đổi chung
      avg_store_dwell_time: { type: Number, default: 0 }, // Thời gian ở lại TB (toàn cửa hàng)
      avg_basket_value: { type: Number, default: 0 }, // Giá trị giỏ hàng TB
    },
    // ===== Dữ liệu Real-time (Cập nhật liên tục) =====
    realtime: {
      people_current: { type: Number, default: 0 },   // Số khách HIỆN TẠI trong cửa hàng
      checkout_length: { type: Number, default: 0 },  // Độ dài hàng chờ HIỆN TẠI
    },
    // Dữ liệu cho biểu đồ "Lưu lượng & Doanh số theo giờ"
    chart_data: [
      {
        hour: Number, // 0-23
        people_count: Number, // Tổng người vào cửa hàng trong giờ đó
        total_revenue: Number, // Tổng doanh thu trong giờ đó
      },
    ],
    // Dữ liệu cho bảng "Top 5 sản phẩm"
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
  },
  {
    collection: "storesummaries", 
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const StoreSummary = mongoose.model("StoreSummary", storeSummarySchema);

module.exports = StoreSummary;