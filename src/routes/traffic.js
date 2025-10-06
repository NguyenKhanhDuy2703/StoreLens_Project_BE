// router/traffic.js
const express = require("express");
const route = express.Router();
const { getHourlyTraffic } = require("../controllers/TrafficController");

route.get("/hourly", getHourlyTraffic);

module.exports = route;
