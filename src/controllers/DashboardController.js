const PersonTracking = require("../schemas/personTracking.schema");
const { getDateRangeVN,getHourlyTrafficData,getAverageDwelltimeToday } = require("../service/DashboardService");
const DailySummary = require("../schemas/dailySummary.schema");
const mongoose = require("mongoose");
const moment = require("moment");
const Store = require("../schemas/store.schema");

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
const getDwelltimeToday = async (req, res) => {
  try {
    const { store_id } = req.params;
    const result = await getAverageDwelltimeToday(store_id);

    res.status(200).json({
      message: "Tính toán dwelltime trung bình thành công",
      data: result
    });
  } catch (error) {
    console.error("Error getAverageDwelltimeToday:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};
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
const getTrend= async (req, res) =>{
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
  };
const getAVGTime = async (req, res) => {
    try {
      const { store_id } = req.params; // có thể không truyền
      const range = req.query.range || "today"; // today | yesterday | week | lastweek | month | lastmonth | year
  
      //  Xác định khoảng thời gian
      let startDate, endDate;
      switch (range) {
        case "yesterday":
          startDate = moment().subtract(1, "days").startOf("day");
          endDate = moment().subtract(1, "days").endOf("day");
          break;
        case "week":
          startDate = moment().startOf("week");
          endDate = moment().endOf("week");
          break;
        case "lastweek":
          startDate = moment().subtract(1, "weeks").startOf("week");
          endDate = moment().subtract(1, "weeks").endOf("week");
          break;
        case "month":
          startDate = moment().startOf("month");
          endDate = moment().endOf("month");
          break;
        case "lastmonth":
          startDate = moment().subtract(1, "months").startOf("month");
          endDate = moment().subtract(1, "months").endOf("month");
          break;
        case "year":
          startDate = moment().startOf("year");
          endDate = moment().endOf("year");
          break;
        default:
          startDate = moment().startOf("day");
          endDate = moment().endOf("day");
          break;
      }
  
      // Điều kiện tìm kiếm
      const matchCondition = {
        status: "inactive",
        end_time: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      };
  
      // Nếu có store_id thì chỉ lấy theo cửa hàng đó
      if (store_id) {
        if (!mongoose.Types.ObjectId.isValid(store_id)) {
          return res.status(400).json({
            success: false,
            message: "store_id không hợp lệ",
          });
        }
  
        const store = await Store.findById(store_id);
        if (!store) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy cửa hàng",
          });
        }
  
        matchCondition.store_id = new mongoose.Types.ObjectId(store_id);
      }
  
      //  Lấy khách đã rời cửa hàng trong khoảng thời gian đó
      const inactiveVisitors = await PersonTracking.find(matchCondition);
  
      if (inactiveVisitors.length === 0) {
        return res.status(200).json({
          success: true,
          avgTime: 0,
          totalVisitors: 0,
          store_id: store_id || null,
          message: `Không có khách nào rời cửa hàng trong khoảng ${range}`,
        });
      }
  
      //  Tính tổng thời gian lưu trú
      let totalDuration = 0;
      let count = 0;
  
      inactiveVisitors.forEach((visitor) => {
        if (visitor.start_time && visitor.end_time) {
          const duration = (visitor.end_time - visitor.start_time) / 1000; // giây
          totalDuration += duration;
          count++;
        }
      });
  
      const avgSeconds = count > 0 ? totalDuration / count : 0;
      const avgMinutes = avgSeconds / 60;
  
      return res.status(200).json({ 
        success: true,
        range,
        store_id: store_id || "all",
        totalVisitors: count,
        avgTimeSeconds: avgSeconds.toFixed(2),
        avgTimeMinutes: avgMinutes.toFixed(2),
        message: store_id
          ? `⏱ Thời gian lưu trú trung bình của cửa hàng (${range})`
          : `⏱ Thời gian lưu trú trung bình toàn hệ thống (${range})`,
      });
    } catch (error) {
      console.error("Lỗi khi tính thời gian lưu trú trung bình:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi tính thời gian lưu trú trung bình",
        error: error.message,
      });
    }
  };
module.exports = {
  getEntered,
  getExited,
  getCurrentlyInside,
  getDwelltimeToday,
  getHourlyTraffic,
  get7DayTrend,
  getTrend,
  getAVGTime
};
