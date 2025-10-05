const mongoose = require("mongoose");
const DailySummary = require("../schemas/dailySummary.schema");

const getTrend = async (req, res) => {
  try {
    const { store_id } = req.params;
    const { range } = req.query; // 7days | week | month | year

    if (!mongoose.Types.ObjectId.isValid(store_id)) {
      return res.status(400).json({ success: false, message: "store_id không hợp lệ" });
    }

    // dùng đk khoảng thời gian
    const now = new Date();
    let startDate;
    switch (range) {
      case "week":
      case "7days":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "year":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    }

    // Truy vấn DailySummary trong khoảng thời gian
    const summaries = await DailySummary.find({
      store_id: new mongoose.Types.ObjectId(store_id),
      date: { $gte: startDate, $lte: now }
    }).sort({ date: 1 });

    // Chuyển dữ liệu cho FE
    const trend = summaries.map(s => ({
      date: s.date.toISOString().split("T")[0],
      total_people: s.summary_metrics?.total_people || 0,
      avg_visit_duration: s.summary_metrics?.avg_visit_duration || 0,
    }));

    res.json({
      success: true,
      range: range || "7days",
      store_id,
      count: trend.length,
      data: trend,
    });
  } catch (error) {
    console.error("Lỗi getTrend:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy dữ liệu xu hướng",
      error: error.message,
    });
  }
};

module.exports = { getTrend };
