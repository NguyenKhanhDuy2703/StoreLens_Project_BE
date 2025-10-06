const express = require("express");
const router = express.Router();
const dwelltimeController = require("../controllers/dwelltimeController");

// Dwelltime route
router.get("/today/:store_id", dwelltimeController.getAverageDwelltimeToday);

module.exports = router;
