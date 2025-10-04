const { getTracking } = require("../api/trackingApi");
const cameraModel = require("../schemas/cameras.schema");
const personTrackingModel = require("../schemas/personTracking.schema");
const personTrackingService = {
  async startTracking(timestamp) {
    try {
      console.log("Tracking started.....");
      const trackingData = await getTracking(timestamp);

      return trackingData;
    } catch (error) {
      console.error("Error in startTracking:", error);
      throw error;
    }
  },
  async saveDataTracking(data) {
    // save data to mongoDB
    // 1 . check camera is exist in DB
    //    1.2 if exist save data to personTracking following camera_id
    //    1.3  if not exist save information camera to DB , then save data to personTracking following camera_id
    // 2. camera is not exist in DB , log error and request add camera to DB
    console.log("Save data tracking started.....");
    const camera_name = data.camera_name;
    const timestamp = data.time_stamp;
    const person_positions = data.data_tracking;

    for (const person in person_positions) {
      const person_id = person;
      const positions = person_positions[person].positions;
      // 1.  check pesion is exist in DB
      //  1.2 if exist update path_data following person_id
      // 2. if not exist create new personTracking
      const personExists = await personTrackingModel.findOne({
        person_id: person_id,
      });
      if (personExists) {
        // update path_data
        await personTrackingModel.updateOne(
          { person_id: person_id },
          {
            // set updated_at and timestamp
            $set: { updated_at: new Date(), timestamp: timestamp },
            // each used to push array
            $push: {
              path_data: {
                $each: positions.map((pos) => [pos[0], pos[1], pos.duration]),
              },
            },
          }
        );
      } else {
        const newPersonTracking = new personTrackingModel({
          store_id: 0,
          camera_id: camera_name,
          person_id: person_id,
          session_id: 0,
          timestamp: timestamp,
          path_data: positions.map((pos) => [pos[0], pos[1], pos.duration]),
          confidence: 0,
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        });
        // save to DB
        await newPersonTracking.save();
      }
    }
    console.log("Save data tracking completed.");
  },
  stopTracking() {
    console.log("Tracking stopped.");
  },
};
module.exports = personTrackingService;
