const { getDateRangeVN } = require("../service/dashBoardService");
const storeModel = require("../schemas/store.model");
const DailySummary = require("../schemas/dailySummary.model");
const cameraModel = require("../schemas/camera.model");
const zoneModel = require("../schemas/zone.model");
const { match } = require("assert");
const getStatusMetrics = async (req, res) => {
  try {
    const { store_id } = req.query;
    const range = req.query.range || "today";
    const { start, end } = getDateRangeVN(range);
    const store = await storeModel.find({ store_id: store_id });
    // check if store exists
    if (!store) {
      return res.status(404).json({
        message: "Store not found",
        store_id: store_id,
      });
    }
    const statusMetricData = await DailySummary.find({
      store_id: store_id,
      // date : { $gte: start, $lte: end }
    }).select("performance");
    const timeStartEnd = `From ${start.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    })} to ${end.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`;
    res.status(200).json({
      message: "Get status metrics successfully",
      data: {
        statusMetric: statusMetricData,
        range: timeStartEnd,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get status metrics",
      error: error.message,
    });
  }
};
const getDataChart = async (req, res) => {
  try {
    const { store_id, range } = req.query;
    const { start, end } = getDateRangeVN(range);
    const checkStore = await storeModel.findOne({
      store_id: store_id,
    });
    if (!checkStore) {
      throw new Error("Store not found");
    }
    const dataChart = await DailySummary.find({
      store_id: store_id,

      // date: { $gte: start, $lte: end }
    }).select("chart_data");
    return res.status(200).json({
      message: "Get data chart successfully",
      data: dataChart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get data chart",
      error: error.message,
    });
  }
};
const getTopProducts = async (req, res) => {
  try {
    const { store_id, range, number = 0 } = req.query;
    const { start, end } = getDateRangeVN(range);
    const checkStore = await storeModel.findOne({
      store_id: store_id,
    });
    if (!checkStore) {
      throw new Error("Store not found");
    }
    const topProducts = await await DailySummary.find({
      store_id: store_id,
      // date: { $gte: start, $lte: end },
    }).select("top_products").limit(Number(number));
    return res.status(200).json({
      message: "Get top products successfully",
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get top products",
      error: error.message,
    });
  }
};
const getPerformanceZones = async (req, res) => {
  try {
    const { store_id, range , zone_id , camera_code  } = req.query;
    const { start, end } = getDateRangeVN(range);
    const checkStore = await storeModel.exists({
      store_id: store_id,
    });
    const checkCamera = await cameraModel.exists({
      camera_code: camera_code,
      store_id: store_id,
    });
    const checkZone = await zoneModel.exists(
      {
        zones: {
          $elemMatch : { zone_id: zone_id } // so sánh cách phần từ ở trong mảng zones
        },
        store_id: store_id,
        camera_code: camera_code
      }
    );
    switch (true){
      case !checkStore:
        throw new Error("Store not found");
      case !checkCamera:
        throw new Error("Camera not found");
      case !checkZone:
        throw new Error("Zone not found");
    }
    const performanceZones = await DailySummary.find({
      store_id: store_id,
      zone_id: zone_id,
      camera_code: camera_code,
      // date: { $gte: start, $lte: end },
    }).select("performance total_revenue");
    console.log(performanceZones);
    return res.status(200).json({
      message: "Get performance zones successfully",
      data: performanceZones,
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Failed to get performance zones",
      error: error.message,
    });
  }
}
module.exports = {
  getStatusMetrics,
  getDataChart,
  getTopProducts,
  getPerformanceZones
};
