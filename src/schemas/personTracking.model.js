const mongoose = require("mongoose");
const { Schema } = mongoose;

const personTrackingSchema = new Schema({
  store_id: { type: String, required: true },
  camera_code: { type: String, required: true },
  person_id: { type: String, required: true },
  session_id: { type: String },
  timestamp: { type: Number },
  date: { type: Date, default: Date.now },
  class: { type: String },
  confidence: { type: Number },
  path_data: [[Number]], // [x, y, duration]
  stop_events: [
    {
      position: [Number],
      duration_s: Number,
      duration_ms: Number,
    },
  ],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
const personTrackingModel = mongoose.model("PersonTracking", personTrackingSchema ,"persontrackings");
module.exports = personTrackingModel
