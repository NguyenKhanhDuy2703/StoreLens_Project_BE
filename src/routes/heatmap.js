const express = require("express");
const router = express.Router();
const heatmapController = require("../controllers/HeatmapController");

// Lấy dữ liệu heatmap cho cửa hàng theo store_id và khoảng thời gian (range: today, yesterday, 7days)
router.get("/data", heatmapController.getHeatmapData);


// Lấy Top 5 khu vực đông khách nhất trong cửa hàng theo store_id và khoảng thời gian
router.get("/top-categories", heatmapController.getTopCategories);


// Thống kê "nhiệt độ" của cửa hàng (vùng nóng, lạnh, điểm nóng, nhiệt độ trung bình)
router.get("/temperature", heatmapController.getTemperatureStats);


// Phân tích theo giờ: số lượng người trong từng khung giờ
router.get("/hourly", heatmapController.getHourlyAnalysis);

module.exports = router;
