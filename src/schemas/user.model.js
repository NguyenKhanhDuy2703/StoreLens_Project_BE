const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  account: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true , unique: true },
  role: { type: String, enum: ['staff', 'manager' , 'admin'], default: 'staff' },
  store_id: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const userModel = mongoose.model('User', userSchema, 'users')
module.exports = userModel
