
const PersonTracking = require("../schemas/personTracking.model");

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isoWeek = require('dayjs/plugin/isoWeek'); // Giúp xác định tuần chính xác (ISO standard)

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
const getDateRangeVN = (range = 'today') => {
  const tz = 'Asia/Ho_Chi_Minh';
  const now = dayjs().tz(tz);

  let start, end;

  switch (range) {
    case 'today':
      start = now.startOf('day');
      end = now.endOf('day');
      break;

    case 'yesterday':
      start = now.subtract(1, 'day').startOf('day');
      end = now.subtract(1, 'day').endOf('day');
      break;

    case '7days':
      start = now.subtract(6, 'day').startOf('day'); // tính cả hôm nay
      end = now.endOf('day');
      break;

    case 'thisWeek':
      start = now.startOf('isoWeek');
      end = now.endOf('isoWeek');
      break;

    case 'lastWeek':
      start = now.subtract(1, 'week').startOf('isoWeek');
      end = now.subtract(1, 'week').endOf('isoWeek');
      break;

    case 'thisMonth':
      start = now.startOf('month');
      end = now.endOf('month');
      break;

    case 'lastMonth':
      start = now.subtract(1, 'month').startOf('month');
      end = now.subtract(1, 'month').endOf('month');
      break;

    default:
      start = now.startOf('day');
      end = now.endOf('day');
  }
  return {
    start: start.toDate(), 
    end: end.toDate(),
  };
};


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
    const sessions = await PersonTracking.find({ store_id: storeId });

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

module.exports = {getDateRangeVN,getHourlyTrafficData,getAverageDwelltimeToday};
