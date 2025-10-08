const PersonTracking = require("../schemas/personTracking.schema");
const Store = require("../schemas/store.schema");
const mongoose = require("mongoose");
const moment = require("moment");

// Thời gian lưu trú trung bình (giây)
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

module.exports = { getAVGTime };
