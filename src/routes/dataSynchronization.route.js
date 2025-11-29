const express = require("express");
const router = express.Router();
const { dataSynchronizationController , dataSynchronizationZoneController } = require("../controllers/dataSynchronozationController");
router.get("/", dataSynchronizationController);
router.get("/zone", dataSynchronizationZoneController);
module.exports = router;
