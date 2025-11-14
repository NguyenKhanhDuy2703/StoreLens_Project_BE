const express = require("express");
const route = express.Router();
const {cameraZonesController , getListCamera , saveNewCameras} = require("../controllers/cameraZonesController");

route.post("/saveZoneForCameras", cameraZonesController);
route.get("/getListCamera" , getListCamera);
route.post("/saveNewCameras" , saveNewCameras)
module.exports = route;
