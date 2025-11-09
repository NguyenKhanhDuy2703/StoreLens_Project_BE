const express = require('express');
const router = express.Router();
const { updateTracking ,  stopStracking} = require("../controllers/personTrackingController")
router.get('/updateTracking', updateTracking);
router.get('/stopTracking' , stopStracking )
module.exports = router;