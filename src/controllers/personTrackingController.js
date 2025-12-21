
const  personTrackingService  = require("../service_AI/personTrackingService");
const updateTracking = async (req, res) => {
  try {
    const { cameraCode } = req.query;
    const data = await personTrackingService.startTracking(cameraCode);
    if (!data.status) {
      return res.status(500).json({ error: data.message || "Failed to start tracking" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in updateTracking:", error);
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
};
const stopStracking = async (req , res ) => {
  try {
    const { cameraCode } = req.query;
    if (!cameraCode) {
      return res.status(400).json({ error: "cameraCode is required" });
    }
     const data = await personTrackingService.stopTracking(cameraCode);
      if (!data.status) {
      return res.status(500).json({ error: data.message || "Failed to stop tracking" });
      } 
    res.status(200).json( data );
  } catch (error) {
    console.error("Error in stopStracking:", error);
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
}
const getDataTracking = async (req , res) => {
  try {
    const data = await personTrackingService.getDataTracking();
    res.status(200).json({message : "Get data tracking successfully" , data : data});
  } catch (error) {
    console.error("Error in getDataTracking:", error);
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
}
module.exports = { updateTracking , stopStracking  , getDataTracking};

