const express = require("express");
const route = express.Router();
const {
  getEntered,
  getExited,
  getCurrentlyInside
} = require("../controllers/DashboardController");
// Đếm ngườivào
route.get("/entered", getEntered);
// Đếm người ra
route.get("/exited", getExited);
// Đếm người đang ở trong cửa hàng
route.get("/inside", getCurrentlyInside);

module.exports = route;
