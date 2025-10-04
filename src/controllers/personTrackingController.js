
const  personTrackingService  = require("../service_AI/personTrackingService");
const  heatmapService =require("../service_AI/heatmapService")
const updateTracking = async (req, res) => {
  try {
    const data = await personTrackingService.startTracking(0);
    await personTrackingService.saveDataTracking(data);
    await personTrackingService.stopTracking();

    //------------- temporation-------------------
    heatmapService.saveHeatmap(data.data_heatmap);
    //------------------------------------------
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in updateTracking:", error);
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
};
module.exports = { updateTracking };
