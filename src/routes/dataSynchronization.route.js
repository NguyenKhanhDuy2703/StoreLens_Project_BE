const express = require("express");
const router = express.Router();
const { dataSynchronizationController } = require("../controllers/dataSynchronozationController");
router.get("/", dataSynchronizationController);
module.exports = router;
