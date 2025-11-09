const heatmapModel = require("../schemas/heatmap.model");
const { getDateRangeVN } = require("../service/dashBoardService");
const heatmapService = require("../service/heatmapService");

// Lấy dữ liệu heatmap
const getHeatmapData = async (req, res) => {
  try {
    const { store_id, range } = req.query;
    const { start, end } = getDateRangeVN(range || "today");

    const query = { created_at: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const heatmaps = await heatmapModel.find(query).lean();

    res.status(200).json({
      store_id: store_id || "all",
      data: heatmaps
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get heatmap data", error: error.message });
  }
};

// Top 5 khu vực đông khách
const getTopCategories = async (req, res) => {
  try {
    const { store_id, range } = req.query;
    const { start, end } = getDateRangeVN(range || "today");

    const query = { created_at: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const heatmaps = await heatmapModel.find(query).lean();
    const topAreas = heatmapService.calculateTopAreas(heatmaps);

    res.status(200).json({ store_id: store_id || "all", data: topAreas });
  } catch (error) {
    res.status(500).json({ message: "Failed to get top areas", error: error.message });
  }
};

// Thống kê “nhiệt độ”
const getTemperatureStats = async (req, res) => {
  try {
    const { store_id, range } = req.query;
    const { start, end } = getDateRangeVN(range || "today");

    const query = { created_at: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const heatmaps = await heatmapModel.find(query).lean();
    const temperatureStats = heatmapService.calculateTemperatureStats(heatmaps);

    res.status(200).json({ store_id: store_id || "all", data: [temperatureStats] });
  } catch (error) {
    res.status(500).json({ message: "Failed to get temperature stats", error: error.message });
  }
};

// Phân tích theo giờ
const getHourlyAnalysis = async (req, res) => {
  try {
    const { store_id, range } = req.query;
    const { start, end } = getDateRangeVN(range || "today");

    const query = { created_at: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const heatmaps = await heatmapModel.find(query).lean();
    const hourlyAnalysis = heatmapService.calculateHourlyAnalysis(heatmaps);

    res.status(200).json({ store_id: store_id || "all", data: hourlyAnalysis });
  } catch (error) {
    res.status(500).json({ message: "Failed to get hourly analysis", error: error.message });
  }
};

module.exports = {
  getHeatmapData,
  getTopCategories,
  getTemperatureStats,
  getHourlyAnalysis
};
