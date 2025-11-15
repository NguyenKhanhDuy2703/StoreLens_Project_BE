const heatmapModel = require("../schemas/heatmap.model")
const getDataHeatmap = async (req, res) => {
  try {
    const { storeId, cameraCode } = req.query;
    const result = await heatmapModel.find({ store_id: storeId, camera_code: cameraCode }).select('-_id -__v');
   
    res.status(200).json({ message: 'Heatmap data retrieved successfully', data : result });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving heatmap data', error: error.message });
  }
};

module.exports = { getDataHeatmap };