const { create } = require("domain");
const { start } = require("repl");
const mongoose = require("mongoose");

const { Schema } = mongoose;
// --- THÊM MỚI: Định nghĩa cấu trúc cho một sự kiện dừng ---
const StopEventSchema = new Schema({
    duration_ms: { type: Number, required: true },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
}, { _id: false }); // _id: false để không tự tạo ObjectId cho mỗi sự kiện
const personTrackingSchema = {
  store_id: { type: String, required: true },
  camera_id: { type: String, required: true },
  person_id: { type: String, required: true },
  session_id: { type: String, required: false },
  timestamp: { type: Number, required: false },
  path_data: {
    type: [[Number]], //  mảng chứa mảng [x, y],
    duration_ms: { type: Number, required: true },
    required: true
  },
  
     stop_events: {
        type: [StopEventSchema], // Sử dụng sub-schema đã định nghĩa ở trên
        default: [] // Giá trị mặc định là một mảng rỗng
    },
  confidence: { type: Number, required: false },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
};
const personTrackingModel = mongoose.model(
  "PersonTracking",
  new Schema(personTrackingSchema)
);
module.exports = personTrackingModel;
