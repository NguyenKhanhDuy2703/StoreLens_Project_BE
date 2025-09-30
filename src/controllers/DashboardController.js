const PersonTracking = require("../schemas/personTracking.schema");
const {  getDateRangeVN } = require("../service/dashboard");

// Đếm số người vào theo khoảng thời gian và cửa hàng
const getEntered = async (req, res) => {
  try {
    const store_id = req.query.store_id || null; // null = tất cả cửa hàng
    const range = req.query.range || "today";     // default today
    const { start, end } =  getDateRangeVN(range);

    const query = {
      created_at: { $gte: start, $lte: end },
      status: "active"
    };
    if (store_id) query.store_id = store_id;

    const enteredCount = await PersonTracking.distinct("person_id", query);

    res.status(200).json({
      message: "Get entered count successfully",
      entered: enteredCount.length,
      store_id: store_id || "all",
      range
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get entered count",
      error: error.message
    });
  }
};

// Đếm số người rời đi theo khoảng thời gian và cửa hàng
const getExited = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = {
      created_at: { $gte: start, $lte: end },
      status: "inactive"
    };
    if (store_id) query.store_id = store_id;

    const exitedCount = await PersonTracking.distinct("person_id", query);

    res.status(200).json({
      message: "Get exited count successfully",
      exited: exitedCount.length,
      store_id: store_id || "all",
      range
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get exited count",
      error: error.message
    });
  }
};

// Số người hiện đang ở bên trong, theo cửa hàng nếu có
const  getCurrentlyInside = async (req, res) => {
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
      inside: latestStatuses.length,
      store_id: store_id || "all"
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
