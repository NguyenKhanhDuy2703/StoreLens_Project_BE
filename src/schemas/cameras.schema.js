
const mongoose = require("mongoose");
const { Schema } = mongoose;
const camerasSchema = {
    store_id : { type: String, required: true },
    camera_name : { type: String, required: true, unique: true },
    camera_code : { type: String, required: true },
    rtsp_url : { type: String, required: true },
    position : {
        x : { type: Number, required: true },
        y : { type: Number, required: true },
    },
    analysis_area:{
        enabled : { type: Boolean, default: false },
        coordinates: [
            {
                x : { type: Number, required: true },
                y : { type: Number, required: true },
                point_order : { type: Number, required: true }
            }
        ],
        area_name : { type: String, required: false },

    },
    camera_spec: {
        max_resolution :{
            width: { type: Number, required: true },
            height: { type: Number, required: true }
        },
    current_resolution :{
            width: { type: Number, required: true },
            height: { type: Number, required: true }
    },
},
    camera_state : {
        last_processed_time : { type: Date, default: Date.now },
        last_stop_time : { type: Date, default: Date.now },
    },
    status : { type: String, enum: ['active', 'inactive'], default: 'active' },
    last_heartbeat : { type: Date, default: Date.now },
    installation_date : { type: Date, required: true },
    created_at : { type: Date, default: Date.now },
    updated_at : { type: Date, default: Date.now }

};
const cameraModel = mongoose.model("Cameras", new Schema(camerasSchema));
module.exports =  cameraModel