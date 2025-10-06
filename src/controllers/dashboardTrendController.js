const mongoose = require("mongoose");
const moment = require("moment");
const PersonTracking = require("../schemas/personTracking.schema");
const DailySummary = require("../schemas/dailySummary.schema");
const Store = require("../schemas/store.schema");

const TrendController = {
  // 📊 Lấy dữ liệu xu hướng (tuần / tháng / năm)
  async getTrend(req, res) {
    try {
      const { store_id } = req.params;
      const range = req.query.range || "7days";

      // --- Kiểm tra store_id ---
      if (!store_id)
        return res.status(400).json({ success: false, message: "Thiếu ID cửa hàng" });
      if (!mongoose.Types.ObjectId.isValid(store_id))
        return res.status(400).json({ success: false, message: "store_id không hợp lệ" });

      const store = await Store.findById(store_id);
      if (!store)
        return res.status(404).json({ success: false, message: "Không tìm thấy cửa hàng" });

      let data = [];

      // ✅ Nếu range = "live" → dùng PersonTracking (trong 7 ngày gần nhất)
      if (range === "live") {
        const startDate = moment().subtract(6, "days").startOf("day");

        data = await PersonTracking.aggregate([
          {
            $match: {
              store_id: new mongoose.Types.ObjectId(store_id),
              start_time: { $gte: startDate.toDate() },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$start_time" } },
              total_people: { $sum: 1 },
              total_duration: {
                $sum: { $subtract: ["$end_time", "$start_time"] }, // tổng thời gian lưu trú (ms)
              },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        // format lại cho đẹp
        const formatted = data.map(item => ({
          date: moment(item._id).format("DD/MM/YYYY"),
          total_people: item.total_people,
          total_duration_minutes: Math.round((item.total_duration || 0) / 60000), // đổi ms → phút
        }));

        return res.json({
          success: true,
          source: "PersonTracking",
          range,
          store_id,
          count: formatted.length,
          data: formatted,
        });
      }

      // ✅ Nếu là tháng / năm → dùng DailySummary
      let startDate;
      if (range === "month") startDate = moment().startOf("month");
      else if (range === "year") startDate = moment().startOf("year");
      else startDate = moment().subtract(6, "days").startOf("day");

      const summaries = await DailySummary.find({
        store_id: new mongoose.Types.ObjectId(store_id),
        date: { $gte: startDate.toDate() },
      })
        .sort({ date: 1 })
        .select("date summary_metrics -_id");

      // format lại dữ liệu cho FE
      const formatted = summaries.map(s => ({
        date: moment(s.date).format("DD/MM/YYYY"),
        total_people: s.summary_metrics?.total_people || 0,
        avg_visit_duration: s.summary_metrics?.avg_visit_duration || 0,
        total_duration_minutes:
          (s.summary_metrics?.total_people || 0) *
          (s.summary_metrics?.avg_visit_duration || 0),
      }));

      res.json({
        success: true,
        source: "DailySummary",
        range,
        store_id,
        count: formatted.length,
        data: formatted,
      });
    } catch (err) {
      console.error("getTrend error:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy xu hướng",
        error: err.message,
      });
    }
  },
};

module.exports = TrendController;
