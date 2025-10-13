const mongoose = require("mongoose");
const { Schema } = mongoose;
const heatmapSchema = {
    store_id : { type: String, required: true },
    camera_id : { type: String, required: true },
    time_stamp : { type: Number, required: false },
    width_matrix : { type: Number, required: false },
    height_matrix : { type: Number, required: false },
    grid_size : { type: Number, required: false },
    frame_width : { type: Number, required: false },
    frame_height : { type: Number, required: false },
    heatmap_matrix : [[Number]], // mảng 2 chiều lưu dữ liệu nhiệt độ
    created_at : { type: Date, default: Date.now },
    updated_at : { type: Date, default: Date.now }
};
const heatmapModel = mongoose.model("Heatmap", new Schema(heatmapSchema));
module.exports = heatmapModel
