const express = require("express");
const route = express.Router();
const visitController = require("../controllers/visitController.js"); 
route.get("/getAVGTime", visitController.getAVGTime);

module.exports = route;
