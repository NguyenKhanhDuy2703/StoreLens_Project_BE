// const  cameras = require("../models/cameras.model");

const cameraZonesController =  (req , res) => {
    try {
        const settingZones = req.body;
        console.log("Received settingZones:", settingZones);
        res.status(200).json({
            message: "Camera Zones Controller is working",
        });
    }
    catch (error) {
        console.error("Error in cameraZonesController:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }           
}
module.exports = {
    cameraZonesController
};
