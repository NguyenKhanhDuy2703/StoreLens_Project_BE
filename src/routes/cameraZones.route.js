const express = require("express");
const route = express.Router();
const {cameraZonesController} = require("../controllers/cameraZonesController");

route.post("/saveZoneForCameras", cameraZonesController);
module.exports = route;
