
const monogoose = require("mongoose");
const { Schema } = monogoose;
// defination schema
const trackingSchema = new Schema({
  person_id: { type: String, required: true },
  camera_name: { type: String, required: true },
  path_datas: { type: Array, required: true },
  start_time:{type:Date, default: Date.now},
  end_time:{type:Date, default: Date.now}

});
const statusAISchema = new Schema({
  camera_name: { type: String, required: true  , unique: true},
  last_timestamp: { type: Number, required: true},
})
// create model
trackingModel = monogoose.model("Tracking", trackingSchema);
statusAIModel = monogoose.model("StatusAI", statusAISchema);
module.exports = { trackingModel , statusAIModel };
