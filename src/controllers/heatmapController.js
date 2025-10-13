const personModel = require("../schemas/personTracking.schema");
const cameraModel = require("../schemas/cameras.schema");
const dailySummaryModel = require("../schemas/dailySummary.schema");
const heatmapService = require("../service/heatmap");
const {getDateRangeVN} = require("../service/dashboard");
// Lấy dữ liệu heatmap
const getHeatmapData = async (req, res) => {
    try {
        const { store_id, range } = req.query;
        const { start, end } = getDateRangeVN(range || "today");

        const paths = await heatmapService.getPaths(personModel, store_id, start, end);
        const heatmapData = heatmapService.calculateHeatmapData(paths, start, end);

        res.status(200).json({ store_id: store_id || "all", heatmapData });
    } catch (error) {
        res.status(500).json({ message: "Failed to get heatmap data", error: error.message });
    }
};


// Top 5 khu vực đông khách
const getTopCategories = async (req, res) => {
    try {
        const { store_id, range } = req.query;
        const { start, end } = getDateRangeVN(range || "today");

        // Lấy các đường đi của người trong cửa hàng
        const paths = await heatmapService.getPaths(personModel, store_id, start, end);

        // Tính Top 5 khu vực đông khách
        const topCategories = await heatmapService.calculateTopCategories(cameraModel, store_id, paths);

        res.status(200).json({ store_id: store_id || "all", topCategories });
    } catch (error) {
        res.status(500).json({ message: "Failed to get top categories", error: error.message });
    }
};


// Thống kê nhiệt độ
const getTemperatureStats = async (req, res) => {
    try {
        const { store_id, range } = req.query;
        const { start, end } = getDateRangeVN(range || "today");

        const paths = await heatmapService.getPaths(personModel, store_id, start, end);
        const heatmapData = heatmapService.calculateHeatmapData(paths, start, end);
        const temperatureStats = heatmapService.calculateTemperatureStats(heatmapData);

        res.status(200).json({ store_id: store_id || "all", temperatureStats });
    } catch (error) {
        res.status(500).json({ message: "Failed to get temperature stats", error: error.message });
    }
};
// Phân tích theo giờ
const getHourlyAnalysis = async (req, res) => {
    try {
        const { store_id, range } = req.query;
        const { start, end } = getDateRangeVN(range || "today");

        const hourlyAnalysis = await heatmapService.calculateHourlyAnalysis(dailySummaryModel, store_id, start, end);

        res.status(200).json({ store_id: store_id || "all", hourlyAnalysis });
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
