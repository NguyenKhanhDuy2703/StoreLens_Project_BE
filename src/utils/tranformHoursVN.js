const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isoWeek = require('dayjs/plugin/isoWeek'); 
dayjs.extend(timezone);
dayjs.extend(isoWeek);
const getDateRangeVN = (range ) => {
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

module.exports = {getDateRangeVN };
