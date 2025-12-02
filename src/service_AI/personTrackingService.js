const {
  getTracking,
  stopTracking,
  getDataFromTracking,
} = require("../api/trackingApi");
const cameraModel = require("../schemas/camera.model");
const personTrackingModel = require("../schemas/personTracking.model");
const heatmapModel = require("../schemas/heatmap.model");
const personTrackingService = {
  async startTracking(cameraCode) {
    try {
      const getInforCamera = await cameraModel
        .findOne({ camera_code: cameraCode })
        .select({ _id: 0, rtsp_url: 1 })
        .lean();
      const rtsp_url = getInforCamera.rtsp_url;
      const trackingData = await getTracking(0, rtsp_url);
      return trackingData;
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
        const { camera_code, store_id } = checkCamera;
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
      for (const item of data) {
        const checkCamera = await cameraModel
          .findOne({ rtsp_url: item.rtsp_url })
          .select("-_id , camera_code , store_id ")
          .lean();
        const { camera_code, store_id } = checkCamera;
        const checkSession = await heatmapModel
          .findOne({
            store_id: store_id,
            camera_code: camera_code,
          })
          .select("-_id , time_stamp");
        if (checkSession != null) {
          const oldTimestamp = new Date(checkSession.time_stamp).getTime() || 0;
          const currentTime = new Date().getTime();
          const FiveMinutes = 5 * 60 * 1000;
          if (currentTime - oldTimestamp < FiveMinutes) {
            // cập nhật heatmap hiện tại
            await heatmapModel.updateOne(
              {
                store_id: store_id,
                camera_code: camera_code,
                time_stamp: checkSession.time_stamp,
              },
              {
                $set: {
                  updated_at: new Date(),
                  time_stamp: currentTime,
                  heatmap_matrix: item.heatmap.heatmap_matrix,
                },
              }
            );
          }
        } else {
          // tạo mới session heatmap
          const newHeatmap = new heatmapModel({
            store_id: store_id,
            camera_code: camera_code,
            time_stamp: new Date(),
            width_matrix: item.heatmap.width_matrix,
            height_matrix: item.heatmap.height_matrix,
            grid_size: item.heatmap.grid_size,
            frame_width: item.heatmap.width_frame,
            frame_height: item.heatmap.height_frame,
            heatmap_matrix: item.heatmap.heatmap_matrix,
            created_at: new Date(),
            updated_at: new Date(),
          });
          await newHeatmap.save();
        }
      }
    } catch (error) {
      throw error;
    }
  },
  async saveStopEvent(data ) {
    try {
      
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
