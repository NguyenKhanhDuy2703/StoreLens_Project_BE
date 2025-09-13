const { getTracking } = require ("../api/trackingApi")
const TrackingController = {
  async startTracking(timestamp) {
    try {
      console.log("Tracking started.....");
      const trackingData = await getTracking(timestamp);
      console.log(JSON.stringify(trackingData));
      return trackingData;
    } catch (error) {
        console.error("Error in startTracking:", error);
        throw error;
    }
  },
  stopTracking() {
    console.log("Tracking stopped.");
  },
};
module.exports = TrackingController;
