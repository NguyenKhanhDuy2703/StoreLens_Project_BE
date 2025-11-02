const mongoose = require("mongoose");
const { Schema } = mongoose;

const zonesSchema = new Schema({
  store_id: { type: String, required: true },
  camera_code: { type: String, required: true },
  background_image: String,
  width_frame: Number,
  height_frame: Number,
  zones: [
    {
      zone_id: { type: String, required: true , unique: true },
      zone_name: { type: String, required: true },
      coordinates: [[Number]], // polygon points
      color: String,
      products: [
        {
          product_id: String,
          priority: Number
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Zones", zonesSchema);
