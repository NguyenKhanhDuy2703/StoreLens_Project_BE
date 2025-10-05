const express = require("express");
const route = express.Router();
const { get7DayTrend } = require("../controllers/trend7DayController.js");
route.get("/get7DayTrend",get7DayTrend)
module.exports = route;