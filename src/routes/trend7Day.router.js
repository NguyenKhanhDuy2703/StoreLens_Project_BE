const express = require("express");
const route = express.Router();
const { get7DayTrend } = require("../controllers/trend7DayController.js");
route.get("/get7DayTrend/:store_id",get7DayTrend)
module.exports = route;