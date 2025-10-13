const { getTracking } = require("../api/trackingApi");
const cameraModel = require("../schemas/cameras.schema");
const personTrackingModel = require("../schemas/personTracking.schema");
const heatmapModel = require("../schemas/heatmap.schema");
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
    try {
      // save data to mongoDB
      // 1 . check camera is exist in DB
      //    1.2 if exist save data to personTracking following camera_id
      //    1.3  if not exist save information camera to DB , then save data to personTracking following camera_id
      // 2. camera is not exist in DB , log error and request add camera to DB
      console.log("Save data tracking started.....");
      const camera_name = data.camera_name;
      const timestamp = data.time_stamp || 0;
      const person_positions = data.data_tracking;
      for (const person in person_positions) {
        const person_id = person;
        const positions = person_positions[person].position;
        const person_class = person_positions[person].class || "unknown";
        const confidence = person_positions[person].confidence || 0;
        const stop_events = person_positions[person].stop_events || [];
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
                  $each: positions.map((pos) => [pos[0], pos[1]]),
                },
                stop_events: {
                  $each: stop_events.map((e) => [
                    {
                      postion: [e.position[0], e.position[1]],
                      duration_s: e.duration_s,
                      duration_ms: e.duraition_ms,
                    },
                  ]),
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
            class: person_class,
            confidence: confidence,
            path_data: positions.map((pos) => [pos[0], pos[1]]),
            stop_events: stop_events.map((e) => [
              {
                position: [e.position[0], e.position[1]],
                duration_s: e.duration_s,
                duration_ms: e.duraition_ms,
              },
            ]),
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          });
          // save to DB
          await newPersonTracking.save();
        }
      }
      console.log("Save data tracking completed.");
    } catch (error) {
      throw error;
    }
  },
  async saveHeatmap(data) {
    try {
      console.log("Save heatmap started.....");
      const camera_name = data.camera_name;
      const timestamp = data.time_stamp || 0;
      const heatmap_data = data.heapmap_data;
      const {width , height , grid_size , frame_width , frame_height , heatmap_matrix } = heatmap_data;
      // check camera is exist in DB
      const cameraExists = await cameraModel.findOne({ camera_name: camera_name });
      if (!cameraExists) {
        throw new Error(`Camera with name ${camera_name} does not exist.`);
      }
      // check heatmap of the camera is exist in DB
      const heatmapExists = await heatmapModel.findOne({
        camera_id: camera_name,
        // timestamp: timestamp, #  develop later time_stamp > 5 minutes  break new document heatmap
      });
      if (heatmapExists) {
        // update heatmap_data
        await heatmapModel.updateOne(
          { camera_id: camera_name, timestamp: timestamp },
          {
            $set: {
              updated_at: new Date(),
              width_matrix: width,
              height_matrix: height,
              grid_size: grid_size,
              frame_width: frame_width,
              frame_height: frame_height,
              heatmap_matrix: [...heatmap_matrix],
            },
          }
        );
      }
      else {
        // create new heatmap
        const newHeatmap = new heatmapModel({
          store_id: 0,
          camera_id: camera_name,
          timestamp: timestamp,
          width_matrix: width,
          height_matrix: height,
          grid_size: grid_size,
          frame_width: frame_width,
          frame_height: frame_height,
          heatmap_matrix: [...heatmap_matrix],
          created_at: new Date(),
          updated_at: new Date(),
        });
        await newHeatmap.save();
      }
      console.log("Save heatmap completed.");
    } catch (error) {
      throw error;
    }
  },
  stopTracking() {
    console.log("Tracking stopped.");
  },
};
module.exports = personTrackingService;
