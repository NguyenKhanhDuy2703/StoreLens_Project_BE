const express = require("express");
const route = express.Router();
const visitController = require("../controllers/visitController.js"); 
route.get("/getAVGTime", visitController.getAVGTime);
route.get("/getAVGTime/:store_id", visitController.getAVGTime);

module.exports = route;
