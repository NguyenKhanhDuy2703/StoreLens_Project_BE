const DailySummary = require("../schemas/dailySummary.schema");
const mongoose = require("mongoose");
const moment = require("moment");

const get7DayTrend = async (req, res) => {
  try {
    const { store_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(store_id)) {
      return res.status(400).json({ success: false, message: "store_id không hợp lệ" });
    }

    // Lấy ngày hôm nay và 6 ngày trước
    const endDate = moment().endOf("day").toDate();
    const startDate = moment().subtract(6, "days").startOf("day").toDate();

    const summaries = await DailySummary.find({
      store_id: new mongoose.Types.ObjectId(store_id),
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Lấy dữ liệu cho chart
    const trend = summaries.map(s => ({
      date: moment(s.date).format("YYYY-MM-DD"),
      total_people: s.summary_metrics?.total_people || 0,
      avg_visit_duration: s.summary_metrics?.avg_visit_duration || 0,
    }));

    res.json({
      success: true,
      store_id,
      startDate,
      endDate,
      trend
    });
  } catch (error) {
    console.error("Error get7DayTrend:", error);
    res.status(500).json({ success: false, message: "Lỗi lấy xu hướng 7 ngày", error: error.message });
  }
};

module.exports = { get7DayTrend };
