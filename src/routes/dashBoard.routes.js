const express = require("express");
const route = express.Router();
const {
  getStatusMetrics,
  getDataChart,
  getTopProducts,
  getPerformanceZones
} = require("../controllers/dashboardController");
route.get("/statusMetrics", getStatusMetrics);
route.get("/dataCharts", getDataChart);
route.get("/topProducts", getTopProducts);
route.get("/performanceZones", getPerformanceZones);

module.exports = route;
