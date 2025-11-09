
const  personTrackingService  = require("../service_AI/personTrackingService");
const updateTracking = async (req, res) => {
  try {
    const data = await personTrackingService.startTracking(0);
    const trackingData = {
      camera_name: data.camera_name,
      fps : data.fps,
      time_stamp: data.time_stamp || 0,
      data_tracking: data.data_tracking,
      stop_events: data.stop_events,
    }
    const heatmapData = {
      camera_name: data.camera_name,
      time_stamp: data.time_stamp || 0,
      heapmap_data: data.heapmap_data,
    }
    await personTrackingService.saveDataTracking(trackingData);
    await personTrackingService.saveHeatmap(heatmapData);
    return res.status(200).json(data);
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
module.exports = { updateTracking , stopStracking };
