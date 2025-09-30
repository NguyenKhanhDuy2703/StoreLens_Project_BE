const express = require("express");
const route = express.Router();
const {
  getEntered,
  getExited,
  getCurrentlyInside
} = require("../controllers/DashboardController");

route.get("/entered", getEntered);
route.get("/exited", getExited);
route.get("/inside", getCurrentlyInside);

module.exports = route;
