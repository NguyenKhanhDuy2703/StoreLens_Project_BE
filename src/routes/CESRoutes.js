const express = require("express");
const router = express.Router();
const cesController = require("../controllers/CESController");

// Sản phẩm tương tác nhiều nhất
router.get("/top-products", cesController.getTopProduct);

// Điểm CES tổng thể
router.get("/ces-score", cesController.getCesScore);

// Loại tương tác
router.get("/types", cesController.getInteractionType);

// Xu hướng tương tác theo giờ
router.get("/hourly-trend", cesController.getHourlyTrend);

// Hiệu suất theo khu vực
router.get("/region-performance", cesController.getAreaPerformance);

module.exports = router;
