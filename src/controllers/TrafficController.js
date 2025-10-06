
const { getHourlyTrafficData } = require("../service/traffic");

const getHourlyTraffic = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";

    const data = await getHourlyTrafficData(store_id, range);

    res.status(200).json({
      message: "Get hourly traffic successfully",
      store_id: store_id || "all",
      range,
      data
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get hourly traffic",
      error: error.message
    });
  }
};

module.exports = { getHourlyTraffic };
