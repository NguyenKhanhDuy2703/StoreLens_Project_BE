const express = require("express");
const route = express.Router();
const { testSaveDataMongo } = require("../controllers/testController");

route.post("/testSaveDataMongo", testSaveDataMongo);

module.exports = route;