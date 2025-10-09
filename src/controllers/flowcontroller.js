const { getDateRangeVN } = require("../service/DashboardService");
const FlowService = require("../service/FlowService");
const personTrackingModel = require("../schemas/personTracking.schema"); 
const heatmapModel = require("../schemas/heatmap.schema");
const cameraModel = require("../schemas/cameras.schema");

// Flow Paths
const getFlowPaths = async (req, reply) => {
  try {
    const store_id = req.query.store_id; 
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { created_at: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const tracks = await personTrackingModel.find(query).lean();
    const data = FlowService.getFlowPaths(tracks);

    return reply.send({ message: "Flow paths fetched", data });
  } catch(err) {
    console.error(err);
    return reply.status(500).send({ message: "Failed to fetch flow paths", error: err.message });
  }
};

// Flow Stats
const getFlowStats = async (req, reply) => {
  try {
    const store_id = req.query.store_id;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { created_at: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const tracks = await personTrackingModel.find(query).lean();
    const data = FlowService.getFlowStats(tracks);

    return reply.send({ message: "Flow stats calculated", data });
  } catch(err) {
    console.error(err);
    return reply.status(500).send({ message: "Failed to calculate flow stats", error: err.message });
  }
};

// Hot Zones
const getHotZones = async (req, reply) => {
  try {
    const store_id = req.query.store_id;

    const heatmaps = store_id 
      ? await heatmapModel.find({ store_id }).lean() 
      : await heatmapModel.find().lean();

    const cameras = store_id 
      ? await cameraModel.find({ store_id }).lean() 
      : await cameraModel.find().lean();

    const data = FlowService.getHotZones(heatmaps, cameras);

    return reply.send({ message: "Hot zones calculated", data });
  } catch(err) {
    console.error(err);
    return reply.status(500).send({ message: "Failed to calculate hot zones", error: err.message });
  }
};

module.exports = {
  getFlowPaths,
  getFlowStats,
  getHotZones
};
