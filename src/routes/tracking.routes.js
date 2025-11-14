const express = require('express');
const router = express.Router();
const { updateTracking ,  stopStracking , getDataTracking} = require("../controllers/personTrackingController")
router.get('/startTracking', updateTracking);
router.get('/stopTracking' , stopStracking )
router.get('/dataTracking' , getDataTracking )
module.exports = router;