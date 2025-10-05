const express = require("express");
const router = express.Router();
const { getTrend } = require("../controllers/dashboardTrendController");

router.get("/:store_id", getTrend);

module.exports = router;
