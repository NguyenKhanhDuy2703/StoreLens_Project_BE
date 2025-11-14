
const cameraModel = require("../schemas/camera.model");
const  personTrackingService  = require("../service_AI/personTrackingService");
const updateTracking = async (req, res) => {
  try {
    const { cameraCode = "C01" } = req.query;
    const data = await personTrackingService.startTracking(0 , cameraCode);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in updateTracking:", error);
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
};
const stopStracking = async (req , res ) => {
  try {
    personTrackingService.stopTracking();
    res.status(200).json( { message : "Tracking stopped successfully"});
  } catch (error) {
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
}
const getDataTracking = async (req , res) => {
  try {
    
    const data = await personTrackingService.getDataTracking();
    const {url_rtsp} = data;
    const inforCamera = await cameraModel.findOne({ rtsp_url : url_rtsp }).select("-_id , camera_code , store_id ").lean();
    const {camera_code , store_id } = inforCamera;
    const dataTracking = data.data_tracking || {};
    const heatmap = data.heatmap_data || {};
    console.log(heatmap)
    await personTrackingService.saveDataTracking(dataTracking , camera_code , store_id);
    await personTrackingService.saveHeatmap(heatmap , camera_code , store_id);
    res.status(200).json({message : "Get data tracking successfully" , data : data});
  } catch (error) {
    console.error("Error in getDataTracking:", error);
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
}
module.exports = { updateTracking , stopStracking  , getDataTracking};

