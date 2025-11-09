const { startOfDay, endOfDay } = require("date-fns");
const dateFnsTz = require("date-fns-tz");
const { utcToZonedTime, zonedTimeToUtc } = dateFnsTz;

const getDateRangeVN = (range) => {
  const timeZone = "Asia/Ho_Chi_Minh";
  const now = new Date();

  let startVN, endVN;

  if (Array.isArray(range) && range.length === 2) {
    startVN = utcToZonedTime(new Date(range[0]), timeZone);
    endVN = utcToZonedTime(new Date(range[1]), timeZone);
  } else {
    const todayVN = utcToZonedTime(now, timeZone);

    switch (range) {
      case "today":
        startVN = startOfDay(todayVN);
        endVN = endOfDay(todayVN);
        break;
      case "yesterday":
        const yesterday = new Date(todayVN);
        yesterday.setDate(yesterday.getDate() - 1);
        startVN = startOfDay(yesterday);
        endVN = endOfDay(yesterday);
        break;
      case "7days":
        const sevenDaysAgo = new Date(todayVN);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        startVN = startOfDay(sevenDaysAgo);
        endVN = endOfDay(todayVN);
        break;
      default:
        startVN = startOfDay(todayVN);
        endVN = endOfDay(todayVN);
    }
  }

  const startUTC = zonedTimeToUtc(startVN, timeZone);
  const endUTC = zonedTimeToUtc(endVN, timeZone);

  return { start: startUTC, end: endUTC };
};

module.exports = { getDateRangeVN };
