
const TrackingController = require("../ModuleAI/TrackingControllerAI");
const { trackingModel, statusAIModel } = require("../schemas/AISchema");
const updateTracking = async (req, res) => {
  try {
    let dataSaveDB = [];
    // get last timestamp from statusAIModel
    let data = {};
    const last_timestamp = await statusAIModel.find().select("last_timestamp");
    console.log("last_timestamp", last_timestamp);
    if (last_timestamp.length === 0) {
      data = await TrackingController.startTracking(0);
    } else {
      data = await TrackingController.startTracking(
        last_timestamp[0].last_timestamp
      );
    }
    const camera_name = data.camera_name;
    const timestamp = data.time_stamp;

    // update last timestamp in statusAIModel
    const camera_name_status = await statusAIModel.findOne({
      camera_name: camera_name,
    });
    console.log("camera_name_status", camera_name_status);
    if (camera_name_status != null) {
      // Update existing entry
      camera_name_status.last_timestamp = timestamp;
      await camera_name_status.save();
    } else {
      // Create new entry
      const newEntry = new statusAIModel({
        camera_name: camera_name,
        last_timestamp: timestamp,
      });
      await newEntry.save();
    }
    const data_tracking = Object.entries(data.data_tracking);
    for (const [person_id, path_datas] of data_tracking) {
      dataSaveDB.push({
        camera_name: camera_name,
        person_id: person_id,
        timestamp: timestamp,
        path_datas: path_datas,
      });
    }
    // check if person_id exists in database update path_datas and timestamp
    // else create new entry
    for (const item of dataSaveDB) {
      const existsEntry = await trackingModel.findOne({
        person_id: item.person_id,
      });
      if (existsEntry) {
        // Update existing entry
        existsEntry.path_datas = item.path_datas;
        existsEntry.timestamp = item.timestamp;
        
        await existsEntry.save();
      } else {
        // Create new entry
        const newEntry = new trackingModel(item);
        await newEntry.save();
      }
    }
    res.status(200).json({ message: "Tracking updated", data: dataSaveDB });
  } catch (error) {
    console.error("Error in tracking:", error);
    res.status(500).json({ message: "Error in tracking", error: error.message });
  }
};
module.exports = { updateTracking };
