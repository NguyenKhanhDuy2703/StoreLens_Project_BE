const express = require("express");
const router = express.Router();
const {
  
  getDwellTimeOverview,
  getZonePerformanceDetails,
  getBarALineChant,
  getRevenueEfficiencyTable,
} = require("../controllers/dwellTimeController");


router.get("/overview", getDwellTimeOverview);
router.get("/performance", getZonePerformanceDetails);
router.get("/chart-sum-pt" ,getBarALineChant );
router.get("/revennue-efficiency" , getRevenueEfficiencyTable);

module.exports = router;
