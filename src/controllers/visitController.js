const PersonTracking = require("../schemas/personTracking.schema");
const mongoose = require("mongoose");

// Thời gian lưu trú trung bình (giây)
const getAVGTime = async (req, res) => {
  try {
    const inactiveVisitors = await PersonTracking.find({ status: "inactive" });

    if (inactiveVisitors.length === 0) {
      return res.status(200).json({
        success: true,
        avgTime: 0,
        message: "Không có khách nào đã rời cửa hàng",
      });
    }

    let totalDuration = 0;
    let count = 0;

    inactiveVisitors.forEach(visitor => {
      if (visitor.start_time && visitor.end_time) {
        const duration = (visitor.end_time - visitor.start_time) / 1000; //đổi sang giây
        totalDuration += duration;
        count++;
      }
    });

    const avg = count > 0 ? (totalDuration / count) : 0;

    return res.status(200).json({
      success: true,
      avgTimeSeconds: avg.toFixed(2),
      totalVisitors: count
    });

  } catch (error) {
    console.error("Lỗi khi tính thời gian lưu trú trung bình:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAVGTime };
