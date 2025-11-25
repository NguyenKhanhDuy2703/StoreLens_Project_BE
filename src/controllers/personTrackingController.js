

const  personTrackingService  = require("../service_AI/personTrackingService");
const updateTracking = async (req, res) => {
  try {
    const { cameraCode } = req.query;
    console.log("Received cameraCode:", cameraCode);
    const data = await personTrackingService.startTracking(cameraCode);
    res.status(200).json({message:`camera ${cameraCode} is analysis`,data});
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
    res.status(200).json({message : "Get data tracking successfully" , data : data});
  } catch (error) {
    console.error("Error in getDataTracking:", error);
    res.status(500).json({ error: error.data || "Internal Server Error" });
  }
}
module.exports = { updateTracking , stopStracking  , getDataTracking};

