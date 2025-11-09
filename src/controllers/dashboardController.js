const { getDateRangeVN } = require("../service/dashBoardService");
const storeModel = require("../schemas/store.model");
const storeSummaryModel = require("../schemas/storesSummary.model");
const ZoneSummary = require("../schemas/zonesSummary.model");

const   getStatusMetrics = async (req, res) => {
  try {
    
    const { store_id , range  } = req.query;
    const { start, end } = getDateRangeVN(range);
    const store = await storeModel.exists({ store_id: store_id });
    // check if store exists
    if (!store ) {
      return res.status(404).json({
        message: "Store not found",
        store_id: store_id,
      });
    }
    const statusMetricData = await storeSummaryModel.find({
      store_id: store_id,
      date: { $gte: start, $lte: end },
    }).select("-_id , kpis , realtime")
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
    const { store_id, range  } = req.query;
    const { start, end } = getDateRangeVN(range);
    const checkStore = await storeModel.exists({
      store_id: store_id,
    });

    if (!checkStore ) {
      throw new Error("Store not found");
    }
    const dataChart = await storeSummaryModel.find({
      store_id: store_id,
      date: { $gte: start, $lte: end }
    }).select("chart_data");
    return res.status(200).json({
      message: "Get data chart successfully",
      data: {
        dataCharts: dataChart,
        rangeL : `${start.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} - ${end.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`
      }
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
    const { store_id, range, number = 0  } = req.query;
    const { start, end } = getDateRangeVN(range);
    const checkStore = await storeModel.findOne({
      store_id: store_id,
    });
   
    if (!checkStore ) {
      throw new Error("Store not found");
    }
    const topProducts = await await storeSummaryModel.find({
      store_id: store_id,
      date: { $gte: start, $lte: end },
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
    const { store_id, range   } = req.query;
    const { start, end } = getDateRangeVN(range);
    const checkStore = await storeModel.exists({
      store_id: store_id,
    });

    const performanceZones = await ZoneSummary.find({
      store_id: store_id,
      date: { $gte: start, $lte: end },
    }).select("-_id  , performance , category_name , trend")
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
