
const heatmapModel = require("../schemas/heatmap.model");
const ZoneModel = require("../schemas/zone.model");
const ZoneSummary = require("../schemas/zonesSummary.model");

/// fillter data : range time ,  => chia dữ liệu API theo từng khung giờ hoặc nữa  tiếng 
const getDataHeatmap = async (req, res) => {
  try {
    const { store_id, camera_code } = req.query;
    // const range = req.query.range
    const result = await heatmapModel.find({ store_id, camera_code }).select('-_id -__v');
    const inforZone = await ZoneModel.findOne({ store_id, camera_code }).select({_id : 0  , background_image : 1 , zones : 1});
    

    res.status(200).json({ message: 'Heatmap data retrieved successfully', data : { heatmap : result  , zone_information : inforZone } });  
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving heatmap data', error: error.message });
  }
};
const metricsHeatmap = async (req, res) => {
  try {
    const { store_id, camera_code } = req.query;
    const result = await ZoneSummary.find({
      store_id, camera_code
    }).select('-_id -performance -created_at -updated_at');
    res.status(200).json({ message: 'Heatmap metrics retrieved successfully', data : result });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving heatmap metrics', error: error.message });
  }
}
const saveHeatmap = async (req, res) => {
  try {
    for (const heatmapData of heatmapBucketsZScore) {
      let newHeatmap = new heatmapModel(heatmapData);
      await newHeatmap.save();
    }
      res.status(200).json({ message: 'Heatmap data saved successfully'  , heatmapBucketsZScore});
  } catch (error) {
    res.status(500).json({ message: 'Error saving heatmap data', error: error.message });
  }
}
module.exports = { getDataHeatmap ,metricsHeatmap   , saveHeatmap};