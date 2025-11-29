const { getDateRangeVN } = require("../service/dwellTimeSevice");
const ZoneSummary = require("../schemas/zonesSummary.model");
const storeModel = require("../schemas/store.model");
const { analyzeZone } = require("../utils/zoneAnalysisEngine");
const dayjs = require('dayjs');

const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const validateRequest = async (req, res) => {
  let { store_id, range } = req.query;
  if (range) range = range.trim();

  if (!store_id || !range) {
    res.status(400).json({ message: "Thiếu store_id hoặc range" });
    return null;
  }

  const store = await storeModel.exists({ store_id });
  if (!store) {
    res.status(404).json({ message: "Store not found", store_id });
    return null;
  }

  return { store_id, range };
};

const getDwellTimeOverview = async (req, res) => {
  try {
    const params = await validateRequest(req, res);
    if (!params) return;

    const { store_id, range } = params;

    const { start, end } = getDateRangeVN(range);

    const diffMs = end.getTime() - start.getTime();

    const prevEnd = dayjs(start).subtract(1, 'millisecond').toDate();
    const prevStart = dayjs(prevEnd).subtract(diffMs, 'millisecond').toDate();

    const createPipeline = (qStart, qEnd) => [
      { $match: { store_id, date: { $gte: qStart, $lte: qEnd } } },
      { $sort: { "performance.avg_dwell_time": 1 } },
      {
        $group: {
          _id: null,
          avg_value: { $avg: "$performance.avg_dwell_time" },
          all_zones: { $push: { zone: "$category_name", val: "$performance.avg_dwell_time" } }
        }
      },
      {
        $project: {
          _id: 0,
          avg_value: 1,
          min_data: { $first: "$all_zones" },
          max_data: { $last: "$all_zones" }
        }
      }
    ];

    const [currResult, prevResult] = await Promise.all([
      ZoneSummary.aggregate(createPipeline(start, end)),
      ZoneSummary.aggregate(createPipeline(prevStart, prevEnd))
    ]);

    const curr = currResult[0] || { avg_value: 0 };
    const prev = prevResult[0] || { avg_value: 0 };

    const kpis = {
      average_dwell_all_zones: {
        value: Number((curr.avg_value || 0).toFixed(2)),
        change: calculateChange(curr.avg_value, prev.avg_value)
      },
      shortest_avg_dwell: {
        zone: curr.min_data?.zone,
        value: curr.min_data?.val || 0,
        change: calculateChange(curr.min_data?.val, prev.min_data?.val)
      },
      longest_avg_dwell: {
        zone: curr.max_data?.zone,
        value: curr.max_data?.val || 0,
        change: calculateChange(curr.max_data?.val, prev.max_data?.val)
      }
    };

    res.status(200).json({
      message: "Get Downtime KPI successfully",
      data: kpis
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getZonePerformanceDetails = async (req, res) => {
  try {
    const params = await validateRequest(req, res);
    if (!params) return;
    const { store_id, range } = params;
    const { start, end } = getDateRangeVN(range);

    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);

    const createPipeline = (qStart, qEnd) => [
      { $match: { store_id, date: { $gte: qStart, $lte: qEnd } } },
      {
        $group: {
          _id: "$zone_id",
          category_name: { $first: "$category_name" },

          sumPeople: { $sum: "$performance.people_count" },
          sumStops: { $sum: "$performance.total_stop_events" },
          sumDuration: { $sum: "$performance.total_stop_time" },

          avgTime: { $avg: "$performance.avg_dwell_time" }
        }
      },
      {
        $project: {
          _id: 0,
          zone_id: "$_id",
          category_name: 1,
          performance: {
            people_count: "$sumPeople",
            total_stop_events: "$sumStops",
            total_stop_time: "$sumDuration",
            avg_dwell_time: { $round: ["$avgTime", 1] }
          }
        }
      }
    ];

    const [currentList, prevList] = await Promise.all([
      ZoneSummary.aggregate(createPipeline(start, end)),
      ZoneSummary.aggregate(createPipeline(prevStart, prevEnd))
    ]);

    const prevMap = {};
    prevList.forEach(item => { prevMap[item.zone_id] = item.performance.avg_dwell_time; });

    const finalZoneList = currentList.map(zone => ({
      ...zone,
      _id: zone.zone_id,
      percentage_change: calculateChange(
        zone.performance.avg_dwell_time,
        prevMap[zone.zone_id] || 0
      )
    }));

    const timeStartEnd = `From ${start.toLocaleString("vi-VN")} to ${end.toLocaleString("vi-VN")}`;

    res.status(200).json({
      message: "Get Zone List successfully",
      data: { list: finalZoneList, range: timeStartEnd }
    });

  } catch (error) {
    console.error("Zone Details Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getBarALineChant = async (req, res) => {
  try {
    let { store_id, range } = req.query;
    if (range) range = range.trim();

    if (!store_id || !range) {
      return res.status(400).json({ message: "Thiếu store_id hoặc range" });
    }

    const store = await storeModel.exists({ store_id });
    if (!store) {
      return res.status(404).json({ message: "Store not found", store_id });
    }

    const { start, end } = getDateRangeVN(range);

    const chartData = await ZoneSummary.aggregate([
      {
        $match: {
          store_id: store_id,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category_name",

          totalTraffic: { $sum: "$performance.people_count" },

          avgDwellTime: { $avg: "$performance.avg_dwell_time" }
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          traffic: "$totalTraffic",
          dwellTime: { $round: ["$avgDwellTime", 1] }
        },
      },
      {
        $sort: { traffic: -1 }
      }
    ]);

    const timeStartEnd = `From ${start.toLocaleString("vi-VN")} to ${end.toLocaleString("vi-VN")}`;

    res.status(200).json({
      message: "Get Efficiency Chart Data successfully",
      data: {
        chart: chartData,
        range: timeStartEnd,
      },
    });

  } catch (error) {
    console.error("Chart Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getRevenueEfficiencyTable = async (req, res) => {
  try {
    let { store_id, range } = req.query;
    if (range) range = range.trim();
    if (!store_id || !range) return res.status(400).json({ message: "Thiếu thông tin" });

    const { start, end } = getDateRangeVN(range);

    const efficiencyData = await ZoneSummary.aggregate([
      { $match: { store_id: store_id, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$category_name",
          totalSales: { $sum: "$performance.total_sales_value" },
          avgTime: { $avg: "$performance.avg_dwell_time" },
          peopleCount: { $sum: "$performance.people_count" }
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalSales: 1,
          peopleCount: 1,
          avgTime: { $round: ["$avgTime", 1] }
        },
      },
      { $sort: { totalSales: -1 } }
    ]);

    let benchmarks = { avgTime: 0, avgSales: 0, avgPeople: 0 };

    if (efficiencyData.length > 0) {
      const count = efficiencyData.length;
      benchmarks = {
        avgTime: efficiencyData.reduce((sum, i) => sum + i.avgTime, 0) / count,
        avgSales: efficiencyData.reduce((sum, i) => sum + i.totalSales, 0) / count,
        avgPeople: efficiencyData.reduce((sum, i) => sum + i.peopleCount, 0) / count,
      };
    }

    const enrichedList = efficiencyData.map(item => {
        const analysis = analyzeZone(item, benchmarks);

        return {
            ...item,
            evaluation: analysis.label,
            action: analysis.action,
            type: analysis.type
        };
    });

    const timeStartEnd = `From ${start.toLocaleString("vi-VN")} to ${end.toLocaleString("vi-VN")}`;

    res.status(200).json({
      message: "Get Revenue Efficiency Analysis successfully",
      data: {
        list: enrichedList,
        benchmarks,
        range: timeStartEnd,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getBarALineChant,
  getDwellTimeOverview,
  getZonePerformanceDetails,
  getRevenueEfficiencyTable,
};