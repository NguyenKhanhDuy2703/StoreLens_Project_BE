const express = require("express");
const route = express.Router();
const {
  getEntered,
  getExited,
  getCurrentlyInside,
  getTrend,
  get7DayTrend,
  getDwelltimeToday,
   getAVGTime,
   getHourlyTraffic
} = require("../controllers/DashboardController");
// Đếm ngườivào
route.get("/entered", getEntered);
// Đếm người ra
route.get("/exited", getExited);
// Đếm người đang ở trong cửa hàng
route.get("/inside", getCurrentlyInside);
route.get("/:store_id", getTrend);
route.get("/today/:store_id", getDwelltimeToday);
route.get("/hourly", getHourlyTraffic);
route.get("/get7DayTrend/:store_id",get7DayTrend)
route.get("/getAVGTime", getAVGTime);
route.get("/getAVGTime/:store_id", getAVGTime);

module.exports = route;
