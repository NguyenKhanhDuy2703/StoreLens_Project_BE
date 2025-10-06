const DailySummary = require("../schemas/dailySummary.schema");
const mongoose = require("mongoose");
const moment = require("moment");

const get7DayTrend = async (req, res) => {
  try {
    // Nhận store_id từ params hoặc query
    let store_id = req.params.store_id || req.query.store_id;

    if (!store_id) {
      return res.status(400).json({ success: false, message: "Thiếu store_id" });
    }

    // Làm sạch ID (loại bỏ ký tự thừa)
    store_id = store_id.toString().replace(/['"\s]/g, "");

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(store_id)) {
      return res
        .status(400)
        .json({ success: false, message: `store_id không hợp lệ: ${store_id}` });
    }

    // Xác định khoảng 7 ngày gần nhất
    const endDate = moment().endOf("day").toDate();
    const startDate = moment().subtract(6, "days").startOf("day").toDate();

    // Truy vấn dữ liệu từ DailySummary
    const summaries = await DailySummary.find({
      store_id: new mongoose.Types.ObjectId(store_id),
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    if (summaries.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không có dữ liệu trong 7 ngày gần nhất",
        store_id,
        trend: [],
      });
    }

    // Xử lý dữ liệu
    let totalPeopleAll = 0;
    let totalDurationAll = 0;
    const trendData = summaries.map((s, index) => {
      const total = s.summary_metrics?.total_people || 0;
      const avgTime = s.summary_metrics?.avg_visit_duration || 0;
      const prev = index > 0 ? summaries[index - 1].summary_metrics?.total_people || 0 : 0;
      const growth = prev > 0 ? (((total - prev) / prev) * 100).toFixed(2) : 0;

      totalPeopleAll += total;
      totalDurationAll += avgTime;

      return {
        date: moment(s.date).format("DD/MM"),
        total_people: total,
        avg_visit_duration: avgTime,
        growth_rate: Number(growth),
      };
    });

    const avgDailyVisitors = (totalPeopleAll / summaries.length).toFixed(2);
    const avgVisitDuration = (totalDurationAll / summaries.length).toFixed(2);

    // Xác định ngày đông khách nhất
    const busiestDay = trendData.reduce((max, day) =>
      day.total_people > max.total_people ? day : max
    );

    // trả kq
    res.status(200).json({
      success: true,
      store_id,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      summary: {
        total_days: summaries.length,
        total_visitors: totalPeopleAll,
        avg_daily_visitors: Number(avgDailyVisitors),
        avg_visit_duration: Number(avgVisitDuration),
        busiest_day: busiestDay,
      },
      trend_data: trendData,
    });
  } catch (error) {
    console.error("Error get7DayTrend:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi lấy xu hướng 7 ngày",
      error: error.message,
    });
  }
};

module.exports = { get7DayTrend };
