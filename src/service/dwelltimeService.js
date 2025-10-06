const personModel = require("../schemas/personTracking.schema");
const { startOfDay, endOfDay } = require("date-fns");
const { utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");

// Hàm lấy thời gian hôm nay theo giờ VN
const getTodayRangeVN = () => {
  const timeZone = "Asia/Ho_Chi_Minh";
  const now = new Date();

  const vnNow = utcToZonedTime(now, timeZone);
  const start = startOfDay(vnNow);
  const end = endOfDay(vnNow);

  const startUTC = zonedTimeToUtc(start, timeZone);
  const endUTC = zonedTimeToUtc(end, timeZone);

  return { start: startUTC, end: endUTC };
};

const getAverageDwelltimeToday = async (storeId) => {
  try {
    const { start, end } = getTodayRangeVN();

    //  Lấy tất cả session của store, không filter timestamp ở Mongo
    const sessions = await personModel.find({ store_id: storeId });

    if (!sessions || sessions.length === 0) {
      return { averageDwellTime: 0, totalSessions: 0 };
    }

    let totalDuration = 0;
    let count = 0;

    sessions.forEach((session) => {
      if (session.path_data && session.path_data.length > 1) {
        // Convert timestamp về Date (tránh lỗi string)
        const first = new Date(session.path_data[0].timestamp);
        const last = new Date(
          session.path_data[session.path_data.length - 1].timestamp
        );

        // Kiểm tra first/last có nằm trong hôm nay (theo VN)
        if (!isNaN(first) && !isNaN(last) && first >= start && last <= end) {
          const durationSec = (last - first) / 1000; // giây
          totalDuration += durationSec;
          count++;
        }
      }
    });

    const avg = count > 0 ? totalDuration / count : 0;

    return {
      averageDwellTime: avg,
      totalSessions: count,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getAverageDwelltimeToday };
