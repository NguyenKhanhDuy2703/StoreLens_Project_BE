const { getTracking , stopTracking  , getDataFromTracking  } = require("../api/trackingApi");
const cameraModel = require("../schemas/camera.model");
const personTrackingModel = require("../schemas/personTracking.model");
const heatmapModel = require("../schemas/heatmap.model");
const personTrackingService = {
  async startTracking(timestamp , cameraCode) {
    try {
      console.log("Tracking started.....");
      const getInforCamera = await cameraModel.findOne({ camera_code : cameraCode  }).select("-_id , rtsp_url").lean();
      const url_rtsp = getInforCamera.rtsp_url;
      const trackingData = await getTracking(0  , url_rtsp);
      return trackingData;
    } catch (error) {
      console.error("Error in startTracking:", error);
      throw error;
    }
  },
  async saveDataTracking(data , camera_code , store_id) {
    try {
      console.log("Save data tracking started.....");
      const timestamp = data.time_stamp || 0;
      const person_positions = data;
      const checkCamera = await cameraModel.findOne({ camera_code: camera_code });
      if (!checkCamera) {
        throw new Error(`Camera with name ${camera_code} does not exist.`);
      }
      const checkStore = await cameraModel.findOne({ store_id: store_id });
      if (!checkStore) {
        throw new Error(`Store with id ${store_id} does not exist.`);
      }
      
      for (const person in person_positions) {
        const person_id = person;
        const positions = person_positions[person].position;
        const person_class = person_positions[person].class ;
        const confidence = person_positions[person].conf || 0;
        const stop_events = person_positions[person].stop_events || [];
        const personExists = await personTrackingModel.findOne({
          person_id: person_id,
        });
        if (personExists) {
          // update path_data
          await personTrackingModel.updateOne(
            { person_id: person_id },
            {
              $set: { updated_at: new Date(), timestamp: timestamp },
              $push: {
                path_data: {
                  $each: positions.map((pos) => [pos[0], pos[1]]),
                },
                stop_events: {
                  $each: stop_events.map((e) => [
                    {
                      postion: [e.position[0], e.position[1]],
                      duration_s: e.duration_s,
                      duration_ms: e.duration_ms,
                    },
                  ]),
                },
              },
            }
          );
        } else {
          const newPersonTracking =  new personTrackingModel({
            store_id: store_id,
            camera_code: camera_code,
            person_id: person_id,
            session_id: "0",
            timestamp: timestamp,
            class: person_class,
            confidence: confidence,
            path_data: positions.map((pos) => [pos[0], pos[1]]),
            status: "active",
            stop_events: stop_events.map((e) => [
              {
                position: [e.position[0], e.position[1]],
                duration_s: e.duration_s,
                duration_ms: e.duration_ms,
              },
            ]),
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          });
        
          // save to DB
         const check =  await newPersonTracking.save();
         
        }
      }
      console.log("Save data tracking completed.");
    } catch (error) {
      throw error;
    }
  },
  async saveHeatmap(data , camera_code , store_id) {

    try {
      console.log("Save heatmap started.....");
      const timestamp = data.time_stamp || 0;
    
    
      const {width , height , grid_size , width_frame, height_frame , heatmap_matrix } = data;
      // check camera is exist in DB
      const cameraExists = await cameraModel.findOne({ camera_code: camera_code });
      if (!cameraExists) {
        throw new Error(`Camera with name ${camera_code} does not exist.`);
      }
      // check heatmap of the camera is exist in DB
      const heatmapExists = await heatmapModel.findOne({
        camera_code: camera_code,
        // timestamp: timestamp, #  develop later time_stamp > 5 minutes  break new document heatmap
      });
      if (heatmapExists) {
        // update heatmap_data
        await heatmapModel.updateOne(
          { camere_code: camera_code, timestamp: timestamp },
          {
            $set: {
              updated_at: new Date(),
              width_matrix: width,
              height_matrix: height,
              grid_size: grid_size,
              frame_width: width_frame,
              frame_height: height_frame,
              heatmap_matrix: [...heatmap_matrix],
            },
          }
        );
      }
      else {
        // create new heatmap
        const newHeatmap = new heatmapModel({
          store_id: store_id,
          camera_code: camera_code,
          timestamp: timestamp,
          width_matrix: width,
          height_matrix: height,
          grid_size: grid_size,
          frame_width: width_frame,
          frame_height: height_frame,
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
  async getDataTracking() {
    try {
      const data = await getDataFromTracking();
      return data;
    } catch (error) {
      throw error;
    }

  },  

  stopTracking() {
    try {
      stopTracking();
    console.log("Tracking stopped.");
    } catch (error) {
      throw error;
    }
  },
};
module.exports = personTrackingService;
