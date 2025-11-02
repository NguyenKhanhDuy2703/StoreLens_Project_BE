const mongoose = require('mongoose');
const { Schema } = mongoose;

const storeSchema = new Schema({
  store_name: { type: String, required: true },
  store_id: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  manager_infor: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  business_hours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
    timezone: { type: String, required: true }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', storeSchema);
