const PersonTracking = require("../schemas/personTracking.schema");
const { getDateRangeVN } = require("../service/dashboard");

// Người vào
const getEntered = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { created_at: { $gte: start, $lte: end }, status: "active" };
    if (store_id) query.store_id = store_id;

    const enteredCount = await PersonTracking.distinct("person_id", query);

    res.status(200).json({
      message: "Get entered count successfully",
      data: [
        {
          store_id: store_id || "all",
          value: enteredCount.length,
          label: "Người vào"
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get entered count",
      error: error.message
    });
  }
};

// Người ra
const getExited = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { created_at: { $gte: start, $lte: end }, status: "inactive" };
    if (store_id) query.store_id = store_id;

    const exitedCount = await PersonTracking.distinct("person_id", query);

    res.status(200).json({
      message: "Get exited count successfully",
      data: [
        {
          store_id: store_id || "all",
          value: exitedCount.length,
          label: "Người ra"
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get exited count",
      error: error.message
    });
  }
};

// Hiện đang ở bên trong
const getCurrentlyInside = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;

    const matchStage = {};
    if (store_id) matchStage.store_id = store_id;

    const latestStatuses = await PersonTracking.aggregate([
      { $sort: { updated_at: -1 } },
      {
        $group: {
          _id: "$person_id",
          status: { $first: "$status" },
          store_id: { $first: "$store_id" }
        }
      },
      { $match: { status: "active", ...matchStage } }
    ]);

    res.status(200).json({
      message: "Get currently inside count successfully",
      data: [
        {
          store_id: store_id || "all",
          value: latestStatuses.length,
          label: "Hiện bên trong"
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get currently inside count",
      error: error.message
    });
  }
};

module.exports = {
  getEntered,
  getExited,
  getCurrentlyInside
};
