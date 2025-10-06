const personTrackingModel = require("../schemas/personTracking.schema");
const cameraModel = require("../schemas/cameras.schema");

const {
  getTopProducts,
  getCesScores,
  getInteractionTypes,
  getHourlyTrends,
  getAreaPerformances
} = require("../service/ces");
// Top interacted products 
const getTopProduct = async (req, res) => {
  try {
    const data = await getTopProducts(personTrackingModel, cameraModel);
    res.json({ message: "Top interacted products", data });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving top interacted products", error });
  }
};

// Overall CES Score 
const getCesScore = async (req, res) => {
  try {
    const cesScore = await getCesScores(personTrackingModel);
    res.json({ message: "Overall CES score", cesScore });
  } catch (error) {
    res.status(500).json({ message: "Error calculating CES score", error });
  }
};
// Interaction types
const getInteractionType = async (req, res) => {
  try {
    const data = await getInteractionTypes(personTrackingModel);
    res.json({ message: "Interaction types", data });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving interaction types", error });
  }
};

// Hourly interaction trend
const getHourlyTrend = async (req, res) => {
  try {
    const data = await getHourlyTrends(personTrackingModel);
    res.json({ message: "Hourly interaction trend", data });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving hourly interaction trend", error });
  }
};

// Area performance 
const getAreaPerformance = async (req, res) => {
  try {
    const data = await getAreaPerformances(personTrackingModel, cameraModel);
    res.json({ message: "Area performance", data });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving area performance", error });
  }
};

module.exports = {
  getTopProduct,
  getCesScore,
  getInteractionType,
  getHourlyTrend,
  getAreaPerformance
};
