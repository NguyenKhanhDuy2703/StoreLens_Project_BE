const mongoose = require("mongoose");
const { Schema } = mongoose;
const zoneSummarySchema = new Schema(
  {
    date: { type: Date, required: true, index: true },  
    store_id: { type: String, required: true, index: true },
    zone_id: { type: String, required: true, index: true },
    camera_code: { type: String, required: true, index: true },
    category_name: { type: String },
    performance: {
      people_count: { type: Number, default: 0 },
      total_sales_value: { type: Number, default: 0 }, 
      total_invoices: { type: Number, default: 0 }, 
      conversion_rate: { type: Number, default: 0 }, 
      total_stop_time: { type : Number , default :0 }, 
      total_stop_events: { type: Number, default: 0 }, 
      avg_dwell_time: { type: Number, default: 0 }, 
      top_product_id: { type: String }, 
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