const mongoose = require("mongoose");
const { Schema } = mongoose;

const camerasSchema = new Schema({
  store_id: { type: String, required: true },
  camera_name: { type: String, required: true, unique: true },
  camera_code: { type: String, required: true },
  rtsp_url: { type: String, required: true },
  // position: { x: Number, y: Number }, vị trí camera trong cửa hàng
  camera_spec: {
    max_resolution: { width: Number, height: Number },
    current_resolution: { width: Number, height: Number }
  },
  camera_state: {
    last_processed_time: { type: Date, default: Date.now },
    last_stop_time: { type: Date, default: Date.now }
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  last_heartbeat: { type: Date, default: Date.now },
  installation_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const cameraModel = mongoose.model("Cameras", camerasSchema);

module.exports = cameraModel;
