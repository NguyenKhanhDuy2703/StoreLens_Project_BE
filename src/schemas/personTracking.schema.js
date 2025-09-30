const mongoose = require('mongoose');
const { Schema } = mongoose;
const personTrackingSchema = {
    store_id: { type: String, required: true },
    camera_id : { type: String, required: true },
    person_id: { type: String, required: true },
    session_id: { type: String, required: true },
    path_data:[
       {
        timestamp: { type: Date, required: true },
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        confidence: { type: Number, required: true}
       }
    ],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
};
const personModel = mongoose.model("PersonTracking", new Schema(personTrackingSchema));
module.exports =  personModel