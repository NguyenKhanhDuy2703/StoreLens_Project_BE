const DailySummary = require("../schemas/dailySummary.schema");
const { getDateRangeVN } = require("../service/DowntimeService");

// ===============================
// Thời gian dừng tại các khu vực
// ===============================
const getDowntimeByArea = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { date: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const result = await DailySummary.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$camera_id",
          avg_duration: { $avg: "$summary_metrics.avg_visit_duration" },
          total_people: { $sum: "$summary_metrics.total_people" },
        },
      },
      {
        $project: {
          _id: 0,
          camera_id: "$_id",
          avg_duration: { $round: ["$avg_duration", 2] },
          total_people: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Get downtime by area successfully",
      store_id: store_id || "all",
      range,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get downtime by area",
      error: error.message,
    });
  }
};

// ===============================
// Thời gian dừng theo giờ
// ===============================
const getDowntimeByHour = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { date: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const result = await DailySummary.aggregate([
      { $match: query },
      { $unwind: "$hourly_breakdown" },
      {
        $group: {
          _id: "$hourly_breakdown.hour",
          avg_duration: { $avg: "$hourly_breakdown.avg_duration" },
          total_people: { $sum: "$hourly_breakdown.people_count" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          avg_duration: { $round: ["$avg_duration", 2] },
          total_people: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Get downtime by hour successfully",
      store_id: store_id || "all",
      range,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get downtime by hour",
      error: error.message,
    });
  }
};

// ===============================
// Tỷ lệ dừng lại
// ===============================
const getStopRate = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { date: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const data = await DailySummary.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total_people: { $sum: "$summary_metrics.total_people" },
          total_stopped: { $sum: { $divide: ["$summary_metrics.total_people", 2] } }, // ví dụ giả định 50% dừng lại
        },
      },
    ]);

    if (!data.length) {
      return res.status(404).json({ message: "No data found" });
    }

    const { total_people, total_stopped } = data[0];
    const stopRate = (total_stopped / total_people) * 100;

    res.status(200).json({
      message: "Get stop rate successfully",
      store_id: store_id || "all",
      range,
      stopRate: Math.round(stopRate),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get stop rate",
      error: error.message,
    });
  }
};

// ===============================
//Tỷ lệ tương tác trung bình
// ===============================
const getAvgEngagement = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { date: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const data = await DailySummary.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total_people: { $sum: "$summary_metrics.total_people" },
          total_interact: { $sum: { $divide: ["$summary_metrics.total_people", 3] } }, // ví dụ giả định 1/3 tương tác
        },
      },
    ]);

    const { total_people, total_interact } = data[0];
    const engagementRate = (total_interact / total_people) * 100;

    res.status(200).json({
      message: "Get average engagement successfully",
      store_id: store_id || "all",
      range,
      engagementRate: Math.round(engagementRate),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get average engagement",
      error: error.message,
    });
  }
};

// ===============================
// Tỷ lệ chuyển đổi mua hàng
// ===============================
const getConversionRate = async (req, res) => {
  try {
    const store_id = req.query.store_id || null;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);

    const query = { date: { $gte: start, $lte: end } };
    if (store_id) query.store_id = store_id;

    const result = await DailySummary.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total_people: { $sum: "$summary_metrics.total_people" },
          total_cus_buy: { $sum: { $toInt: "$total_cus_buy" } },
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "No data found" });
    }

    const { total_people, total_cus_buy } = result[0];
    const conversionRate = (total_cus_buy / total_people) * 100;

    res.status(200).json({
      message: "Get conversion rate successfully",
      store_id: store_id || "all",
      range,
      conversionRate: Math.round(conversionRate),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get conversion rate",
      error: error.message,
    });
  }
};

module.exports = {
  getDowntimeByArea,
  getDowntimeByHour,
  getStopRate,
  getAvgEngagement,
  getConversionRate,
};
