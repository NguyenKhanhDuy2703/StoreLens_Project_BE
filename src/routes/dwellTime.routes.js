const express = require("express");
const route = express.Router();
const {
  getDowntimeByArea,
  getDowntimeByHour,
  getStopRate,
  getAvgEngagement,
  getConversionRate,
} = require("../controllers/dwellTimeController");

route.get("/area", getDowntimeByArea);
route.get("/hour", getDowntimeByHour);
route.get("/stoprate", getStopRate);
route.get("/engagement", getAvgEngagement);
route.get("/conversion", getConversionRate);

module.exports = route;
