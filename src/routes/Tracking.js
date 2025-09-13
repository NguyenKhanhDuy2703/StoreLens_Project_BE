const express = require('express');
const router = express.Router();
const { updateTracking} = require("../controllers/TrackingController")

router.get('/updateTracking', updateTracking);
module.exports = router;