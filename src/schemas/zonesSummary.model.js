const mongoose = require("mongoose");
const { Schema } = mongoose;
const zoneSummarySchema = new Schema(
  {
    date: { type: Date, required: true, index: true },     // ngày tổng hợp
    store_id: { type: String, required: true, index: true },
    zone_id: { type: String, required: true, index: true },  // zone cụ thể
    camera_code: { type: String, required: true, index: true },
    category_name: { type: String }, // tên khu vực: "Khu đồ uống", "Khu bánh kẹo"
    // Dữ liệu hiệu suất của RIÊNG ZONE NÀY
    performance: {
      people_count: { type: Number, default: 0 }, // tổng số người VÀO ZONE
      total_sales_value: { type: Number, default: 0 }, // tổng giá trị bán hàng TẠI ZONE
      total_invoices: { type: Number, default: 0 }, // tổng hóa đơn liên quan TỚI ZONE
      conversion_rate: { type: Number, default: 0 }, // tỷ lệ chuyển đổi CỦA ZONE
      avg_dwell_time: { type: Number, default: 0 }, // thời gian ở lại TB (phút) TRONG ZONE
      total_stop_events: { type: Number, default: 0 }, // số sự kiện dừng TRONG ZONE
      top_product_id: { type: String }, // mã sản phẩm nổi bật CỦA ZONE
      peak_hour: { type: Number, default: 0 }, // giờ cao điểm CỦA ZONE
    },
    trend: { type: String, enum: ["up", "down", "steady"], default: "steady" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: "zonesummaries", 
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// Đổi tên Model và export
const ZoneSummary = mongoose.model("ZoneSummary", zoneSummarySchema);

module.exports = ZoneSummary;