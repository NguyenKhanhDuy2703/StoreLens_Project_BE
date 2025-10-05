const express = require("express");
const route = express.Router();
const KhachController = require("../controllers/khachController.js"); 
route.post("/checkin", KhachController.checkIn);
route.post("/checkout", KhachController.checkOut);
route.get("/active/:store_id", KhachController.getActive);

module.exports = route;