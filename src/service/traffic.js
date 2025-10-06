// service/traffic.js
const PersonTracking = require("../schemas/personTracking.schema");
const { getDateRangeVN } = require("./dashboard");
const { utcToZonedTime } = require("date-fns-tz");

const timeZone = "Asia/Ho_Chi_Minh";

/**
 * Lấy dữ liệu traffic (entry / exit) theo từng giờ trong ngày
 */
const getHourlyTrafficData = async (store_id, range = "today") => {
  const { start, end } = getDateRangeVN(range);

  const matchStage = {
    created_at: { $gte: start, $lte: end }
  };
  if (store_id) matchStage.store_id = store_id;

  // Gom dữ liệu theo giờ (theo status active/inactive)
  const hourlyStats = await PersonTracking.aggregate([
    { $match: matchStage },
    {
      $project: {
        hour: { $hour: { date: "$created_at", timezone: timeZone } },
        status: 1
      }
    },
    {
      $group: {
        _id: { hour: "$hour", status: "$status" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.hour": 1 } }
  ]);

  // Đưa dữ liệu về dạng FE mong muốn
  const result = [];
  for (let h = 6; h <= 20; h++) {
    const entryData = hourlyStats.find(
      (x) => x._id.hour === h && x._id.status === "active"
    );
    const exitData = hourlyStats.find(
      (x) => x._id.hour === h && x._id.status === "inactive"
    );
    result.push({
      time: `${h}h`,
      entry: entryData ? entryData.count : 0,
      exit: exitData ? exitData.count : 0
    });
  }

  return result;
};

module.exports = { getHourlyTrafficData };
