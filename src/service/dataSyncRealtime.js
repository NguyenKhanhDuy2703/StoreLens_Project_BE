// const cameraModel = require("../schemas/camera.model");
// // Import service vừa tạo
// const zoneConfigService = require("./zoneConfig");
// const  synchronizeRealTimeData = {
//     async syncRealTimeData(dataTracking) {
//         try {
//             console.log("Synchronizing real-time data...");
//             for (const item of dataTracking) {
//                 console.log("Processing item:", item);
//                 const {rtsp_url, data} = item;
//                 const checkCamera = await cameraModel
//                     .findOne({ rtsp_url: rtsp_url })
//                     .select("-_id , camera_code , store_id ")
//                     .lean();
//                 if (!checkCamera) {
//                     console.warn(`Camera with RTSP URL ${rtsp_url} not found.`);
//                     continue;
//                 }
//                 const { camera_code, store_id } = checkCamera;
//                 const config = zoneConfigService.getConfig(rtsp_url);
                
               
//             }
//         }catch (error) {
//             throw error;
//         }
//     }

// }
// module.exports =  synchronizeRealTimeData;