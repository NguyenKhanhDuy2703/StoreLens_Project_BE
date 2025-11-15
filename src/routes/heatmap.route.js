const express = require('express');
const route = express.Router();
const { getDataHeatmap } = require('../controllers/heatmapController');
route.get('/', getDataHeatmap);
module.exports = route;