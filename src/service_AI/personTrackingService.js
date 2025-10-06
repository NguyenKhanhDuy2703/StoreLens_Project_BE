const { getTracking } = require("../api/trackingApi");
const cameraModel = require("../schemas/cameras.schema");
const personTrackingModel = require("../schemas/personTracking.schema");

const personTrackingService = {
  // Hàm này giữ nguyên
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
    
    // Giữ nguyên cấu trúc gốc của bạn
    console.log("Save data tracking started.....");
    const camera_name = data.camera_name;
    const timestamp = data.time_stamp;
    const person_positions = data.data_tracking;
    
    for (const person in person_positions) {
      const person_id = person;
      const positions = person_positions[person].positions;
   
      // THÊM MỚI 1: Lấy mảng stop_events từ dữ liệu AI
      const stop_events = person_positions[person].stop_events;
   
      // check person
      const personExists = await personTrackingModel.findOne({
        person_id: person_id,
      });
      console.log("stop_event : " , stop_events[0])
      if (personExists) {
        // Cập nhật người đã có trong DB
        await personTrackingModel.updateOne(
          { person_id: person_id },
          {
            $set: { updated_at: new Date(), timestamp: timestamp },
            $push: {
              path_data: {
                $each: positions.map((pos) => [pos[0], pos[1], pos.duration]),
              },
              // THÊM MỚI 2: Nối (append) mảng stop_events vào bản ghi đã có
              stop_events: {
                $each: stop_events.map((e) => {
                return  {
                  duration_ms : e.duration_ms , 
                  position:{
                    x: e.position[0] , 
                    y:e.position[1]
                  }
                }
            })  
              },
            },
          }
        );
      } else {
        // Tạo người mới nếu chưa có trong DB
        const newPersonTracking = new personTrackingModel({
          store_id: 0,
          camera_id: camera_name,
          person_id: person_id,
          session_id: 0,
          timestamp: timestamp,
          path_data: positions.map((pos) => [pos[0], pos[1], pos.duration]),

          // THÊM MỚI 3: Thêm trường stop_events khi tạo mới bản ghi
          stop_events: stop_events.map((e) => {
                return  {
                  duration_ms : e.duration_ms , 
                  position:{
                    x: e.position[0] , 
                    y:e.position[1]
                  }
                }
            }) 
          ,

          confidence: 0,
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        });
       const response =  await newPersonTracking.save();
       
      }
    }
    console.log("Save data tracking completed.");
  },

  // Hàm này giữ nguyên
  stopTracking() {
    console.log("Tracking stopped.");
  },
};

module.exports = personTrackingService;
