const { create } = require("domain");
const { start } = require("repl");
const mongoose = require("mongoose");
const { type } = require("os");

const { Schema } = mongoose;
const personTrackingSchema = {
  store_id: { type: String, required: true },
  camera_id: { type: String, required: true },
  person_id: { type: String, required: true },
  session_id: { type: String, required: false },
  timestamp: { type: Number, required: false },
  class: { type: String, required: false },
  confidence: { type: Number, required: false },
  path_data:  [[Number]], //  mảng chứa mảng [x, y, duration],
  stop_events: [
    [{
       position: [Number], 
       duration_s: Number,
       duration_ms: Number,
       _id : false
     }],
  ],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
};
const personTrackingModel = mongoose.model(
  "PersonTracking",
  new Schema(personTrackingSchema)
);
module.exports = personTrackingModel;
