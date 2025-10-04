const { create } = require("domain");
const { start } = require("repl");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const personTrackingSchema = {
  store_id: { type: String, required: true },
  camera_id: { type: String, required: true },
  person_id: { type: String, required: true },
  session_id: { type: String, required: false },
  timestamp: { type: Number, required: false },
  path_data: {
    type: [[Number]], //  mảng chứa mảng [x, y, duration]
    required: true
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
