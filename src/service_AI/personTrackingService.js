const {
  getTracking,
  stopTracking,
  getDataFromTracking
  
} = require("../api/trackingApi");
const cameraModel = require("../schemas/camera.model");
const personTrackingModel = require("../schemas/personTracking.model");
const heatmapModel = require("../schemas/heatmap.model");
const BUCKET_DURATION_S = 0.25 * 60 ; // 15 minutes in seconds
const {getDateRangeVN} = require ("../utils/tranformHoursVN.js")
const personTrackingService = {
  async startTracking(cameraCode) {
    try {
      const getInforCamera = await cameraModel
        .findOne({ camera_code: cameraCode })
        .select({ _id: 0, rtsp_url: 1 })
        .lean();
        console.log("Camera Info:", getInforCamera , cameraCode);
      const rtsp_url = getInforCamera.rtsp_url;
      const setActiveCamera = await cameraModel.updateOne(
        { camera_code: cameraCode },
        { $set: { status: "active", last_heartbeat: new Date() } }
      );
      if (setActiveCamera.acknowledged !== true) {
        throw new Error("Failed to set camera as active");
      }
      await getTracking(rtsp_url);
      return { status : true , message : `Tracking started for camera ${cameraCode}`};
    } catch (error) {
      console.error("Error in startTracking:", error);
      throw error;
    }
  },
  async saveDataTracking(data) {
    try {
      if (!data || data.length === 0) {
        return;
      }  
      for (const item of data) {
        const checkCamera = await cameraModel
          .findOne({ rtsp_url: item.rtsp_url })
          .select("-_id , camera_code , store_id ")
          .lean();
        
        const { camera_code , store_id } = checkCamera;
        if (!item.data || item.data.length === 0) {
          continue;
        }
        for (const record of item.data) {
          const checkPersonExists = await personTrackingModel.findOne({
            store_id: store_id,
            camera_code: camera_code,
            person_id: record.track_id,
          });
          if (checkPersonExists) {
            // update person tracking data
            await personTrackingModel.updateOne(
              {
                store_id: store_id,
                camera_code: camera_code,
                person_id: record.track_id,
              },
              {
                $set: {
                  updated_at: new Date(),
                  date: new Date(),
                },
                $push: {
                  path_data: record.position,
                },
              }
            );
          } else {
            // create new person tracking data
            const newPersonTracking = new personTrackingModel({
              store_id: store_id,
              camera_code: camera_code,
              person_id: record.track_id,
              path_data: record.position,
              timestamp: record.time_stamp,
              created_at: new Date(),
              updated_at: new Date(),
            });
            await newPersonTracking.save();
          }
        }
      }
    } catch (error) {
      throw error;
    }
  },
 async saveHeatmap(data) {
    try {
        const promises = data.map(async (item) => {
          console.log("Processing heatmap for RTSP URL:", item);
            const checkCamera = await cameraModel
                .findOne({ rtsp_url: item.rtsp_url })
                .select("-_id , camera_code , store_id ")
                .lean();
            if (!checkCamera) {
                console.warn(`Camera not found for RTSP URL: ${item.rtsp_url}. Skipping data.`);
                return; 
            }
            const { camera_code, store_id } = checkCamera;
            const now = new Date();
            const bucketStartTimeMs = Math.floor(item.timestamp / BUCKET_DURATION_S) * BUCKET_DURATION_S;
            console.log("Bucket Start Time (ms):", bucketStartTimeMs , item.timestamp);
        
            const dateOnly = new Date(); 
            const {start , end} = getDateRangeVN(dateOnly);
            const query = {
                store_id: store_id,
                camera_code: camera_code,
                date: { $gte: start , $lte: end },
                time_stamp: bucketStartTimeMs,
            };

            const update = {
              
                $setOnInsert: {
                    date: dateOnly,
                    width_matrix: item.heatmap.width_matrix,
                    height_matrix: item.heatmap.height_matrix,
                    grid_size: item.heatmap.grid_size,
                    frame_width: item.heatmap.width_frame,
                    frame_height: item.heatmap.height_frame,
                    created_at: now,
                },
                $set: {
                    heatmap_matrix: item.heatmap.heatmap_matrix, 
                    updated_at: now, 
                }
            };
            
            await heatmapModel.updateOne(query, update, { upsert: true });
        });
        
        await Promise.all(promises);

    } catch (error) {

        console.error("Error saving heatmap data:", error);
        throw error;
    }
},
  async saveStopEvent(data ) {
    try {
      console.log("Saving stop event data:", data);
      for (const item of data) {
         const checkCamera = await cameraModel
        .findOne({ rtsp_url: item.rtsp_url })
        .select("-_id , camera_code , store_id ")
        .lean();
      const { camera_code, store_id } = checkCamera;
        const { track_id, x_position, y_position, duration_s } = item.event;
        const checkPersonExists = await personTrackingModel.findOne({
          store_id: store_id,
          camera_code: camera_code,
          person_id: track_id,
        }).select({_id : 0 , persion_id : 1 , stop_events:1}).lean();
       
        if (checkPersonExists) {
          await personTrackingModel.updateOne(
            {
              store_id: store_id,
              camera_code: camera_code,
              person_id: track_id,
            },
            {
              $set: {
                updated_at: new Date(),
              },
              $push: {
                stop_events: {
                  position: [x_position, y_position],
                  duration_s: duration_s,
                  duration_ms: duration_s * 1000,
                },
              },
            },
            {_id : false}
          );
        }
      }
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
  async stopTracking(CameraCode) {
    try {
      const setInactiveCamera = await cameraModel.updateOne(
        { camera_code: CameraCode },
        { $set: { status: "inactive" } }
      );
      if (setInactiveCamera.acknowledged !== true) {
        throw new Error("Failed to set camera as inactive");
      }
      await stopTracking();
      return  { status : true , message : `Tracking stopped for camera ${CameraCode}`};
    } catch (error) {
      throw error;
    }
  },
};
module.exports = personTrackingService;
