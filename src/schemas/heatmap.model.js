const mongoose = require("mongoose");
const { Schema } = mongoose;

const heatmapSchema = new Schema({
  store_id: { type: String, required: true },
  camera_code: { type: String, required: true },
  time_stamp: { type: Number },
  width_matrix: { type: Number },
  height_matrix: { type: Number },
  grid_size: { type: Number },
  frame_width: { type: Number },
  frame_height: { type: Number },
  heatmap_matrix: [[Number]], // 2D matrix
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Heatmap", heatmapSchema);
