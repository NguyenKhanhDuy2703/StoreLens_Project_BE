const express = require('express');
const route = express.Router();
const { getDataHeatmap  , metricsHeatmap , saveHeatmap} = require('../controllers/heatmapController');
route.get('/', getDataHeatmap);
route.get('/metrics', metricsHeatmap);
route.post('/save', saveHeatmap);
module.exports = route;