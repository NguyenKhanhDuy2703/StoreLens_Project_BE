const cameraModel = require("../schemas/camera.model");
const ZoneModel = require("../schemas/zone.model");
const { camerasData, ZonesData } = require("../dataSample");
const storeModel = require("../schemas/store.model");
const cameraZonesController = async (req, res) => {
  try {
    // const settingZones = req.body;
    // check camera_code is exist in DB
    for (const zoneData of ZonesData) {
      let newZone = await new ZoneModel(zoneData);
      newZone.save();
    }
    res.status(200).json({
      message: "Camera Zones Controller is working",
    });
  } catch (error) {
    console.error("Error in cameraZonesController:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getListCamera = async (req, res) => {
  try {
    const { type = "" } = req.query;
    const listCameras = await cameraModel.aggregate([
      {
        $match: type ? { camera_code: type } : {},
      },
      {
        $project: {
          _id: 0,
          __v: 0,
        },
      },
      {
        $lookup: {
          from: "zones",
          let: { camera_code: "$camera_code" },
          pipeline: [
            { $match: { $expr: { $eq: ["$camera_code", "$$camera_code"] } } },
            {
              $project: { _id: 0, store_id: 0, camera_code: 0, __v: 0 },
            },
          ],
          localField: "camera_code",
          foreignField: "camera_code",
          as: "zones_info",
        }
      },{
         $unwind: {
            path: "$zones_info",
            preserveNullAndEmptyArrays: true
        }
      }
    ]);

    res.status(200).json({
      message: "Get list camera successfully",
      data: listCameras,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get list camera",
      error: error.message,
    });
  }
};
const saveNewCameras = async (req, res) => {
  try {
    const { cameraCode } = req.params;
    const {ImageURL , heightFrame ,widthFrame ,zones ,zoneId } = req.body;
    const existingCamera = await cameraModel.findOne({ camera_code: cameraCode });
    if (!existingCamera) {
      return res.status(404).json({
        message: `Camera with code ${cameraCode} not found`,
      });
    }
    const storeId = existingCamera.store_id;
    const checkStore = await storeModel.exists({ store_id: storeId });
    if (!checkStore) {
      return res.status(404).json({
        message: `Store with id ${storeId} not found`,
      });
    }
    const checkInfoZone = await ZoneModel.findOne({ camera_code: cameraCode  , store_id : storeId });
    if (checkInfoZone) {
      await ZoneModel.updateOne(
        { camera_code: cameraCode , store_id : storeId },
        {
          $set: {
            background_image: ImageURL,
            width_frame: widthFrame,
            height_frame: heightFrame,
            zones: JSON.parse(zones),
          },
        }
      );
    }else{
      const newZone = new ZoneModel({
      store_id: storeId,
      camera_code: cameraCode,
      zone_id : zoneId ,
      background_image: ImageURL,
      width_frame: widthFrame,
      height_frame: heightFrame,
      zones: JSON.parse(zones),
    });
    await newZone.save();
    }
    res.status(200).json({
      message: "New cameras saved successfully",

    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save new cameras",
      error: error.message,
    });
  }
};

module.exports = {
  cameraZonesController,
  getListCamera,
  saveNewCameras,
};
