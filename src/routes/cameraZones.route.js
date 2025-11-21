const express = require("express");
const route = express.Router();
const {cameraZonesController , getListCamera , saveNewCameras} = require("../controllers/cameraZonesController");
const { mwHandleUploadSingle } = require("../middlewares/handleUploadimg");
route.post("/", cameraZonesController);
route.get("/" , getListCamera);
route.post("/:cameraCode/zones",mwHandleUploadSingle  ,saveNewCameras)
module.exports = route;
