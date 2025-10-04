const mongoose = require("mongoose");
const { Schema } = mongoose;
const heatmapSchema = {
    store_id : { type: String, required: true },
    camera_id : { type: String, required: true },
    heatmap_data : { type: [[Number]], required: true }, // 2D array representing heatmap intensity values
    created_at : { type: Date, default: Date.now },
    updated_at : { type: Date, default: Date.now }
};
const heatmapModel = mongoose.model("Heatmap", new Schema(heatmapSchema));
module.exports = heatmapModel
