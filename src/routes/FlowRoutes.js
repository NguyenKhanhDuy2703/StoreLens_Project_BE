const express = require("express");
const router = express.Router();
const flowController = require("../controllers/FlowController");

// Flow Paths(Dữ liệu luồng di chuyển)
router.get("/paths", flowController.getFlowPaths);

// Flow Stats(Thống kê luồng di chuyển)
router.get("/stats", flowController.getFlowStats);

// Hot Zones(Điểm nóng)
router.get("/hotzones", flowController.getHotZones);

module.exports = router;
