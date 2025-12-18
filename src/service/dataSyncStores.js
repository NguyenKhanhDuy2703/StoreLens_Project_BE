const personTrackingModel = require("../schemas/personTracking.model.js");
const StoreSummary = require("../schemas/storesSummary.model.js");
const storeModel = require("../schemas/store.model.js");
const InvoiceModel = require("../schemas/invoice.model.js");
const { getDateRangeVN } = require("../utils/tranformHoursVN");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Ho_Chi_Minh";
const synchronizeStoreData = {
  async syncBatchDailySummaries({ storeId, date }) {
    try {
      // Kiểm tra store
      const storeExists = await storeModel.exists({ store_id: storeId });
      if (!storeExists) throw new Error(`Store ID ${storeId} does not exist.`);

      const { start, end } = getDateRangeVN(date);

      // Lấy dữ liệu visitor
     const visitorData = await personTrackingModel.aggregate([
    { 
        $match: { 
            store_id: storeId, 
            date: { $gte: start, $lte: end } 
        } 
    },
    {
        $project: {
            person_id: 1,
            events: { $ifNull: ["$stop_events", []] }
        }
    },
    {
        $group: {
            _id: null,
            uniquePeople: { $addToSet: "$person_id" },
            totalDwellTime: { $sum: { $sum: "$events.duration_s" } },
            totalStopCount: { $sum: { $size: "$events" } }
        }
    },
    {
        $project: {
            _id: 0,
            visitorCount: { $size: "$uniquePeople" }, // Số khách vào
            totalStopEvents: "$totalStopCount",       // Số lần dừng
            avgDurationS: {                           // Trung bình thời gian dừng
                 $cond: [
                    { $eq: [{ $size: "$uniquePeople" }, 0] },
                    0,
                    { $divide: ["$totalDwellTime", { $size: "$uniquePeople" }] }
                ]
            }
        }
    }
]);
      if (!visitorData.length) throw new Error("No visitor data found.");
      // Lấy dữ liệu invoice
      const invoiceData = await InvoiceModel.aggregate([
        { $match: { store_id: storeId, date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total_amount" },
            totalInvoices: { $sum: 1 },
          },
        },
        { $project: { _id: 0, totalRevenue: 1, totalInvoices: 1 } },
      ]);
      if (!invoiceData.length) throw new Error("No invoice data found.");
      // check date storesummary hôm nay có chưa
      const existingSummary = await StoreSummary.findOne({
        store_id: storeId,
        date: { $gte: start, $lte: end },
      });
      if (!existingSummary) {
        const newSummary = new StoreSummary({
          store_id: storeId,
          date: start,
          kpis: {},
          realtime: {},
          chart_data: [],
          top_products: [],
        });
        await newSummary.save();
      }

      const visitor = visitorData[0];
      const invoice = invoiceData[0];

      const kpis = {
        total_visitors: visitor.visitorCount || 0,
        total_revenue: invoice.totalRevenue || 0,
        total_invoices: invoice.totalInvoices || 0,
        conversion_rate: visitor.visitorCount
          ? ((invoice.totalInvoices / visitor.visitorCount) * 100).toFixed(2)
          : 0,
        avg_store_dwell_time: Number(visitor.avgDurationS.toFixed(3)) || 0,
        avg_basket_value: invoice.totalInvoices
          ? invoice.totalRevenue / invoice.totalInvoices
          : 0,
      };
      const topProductsData = await InvoiceModel.aggregate(
        [
          { $match: 
            { store_id: storeId, date: { $gte: start, $lte: end } } },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product_id",
            product_name: { $first: "$products.name_product" },
            total_quantity: { $sum: "$products.quantity" },
            total_revenue: { $sum: "$products.total_price" },
          },
        },
        {
          $sort: { total_revenue: -1 },
        },
        {
          $limit: 5,
        },
        {$project :{
            _id: 0,
            product_id: "$_id",
            product_name: 1,
            total_quantity: 1,
            total_revenue: 1,
        }}
      ]
      );
      

      await this.syncKpis({ storeId, start, end, kpis });
      await this.syncChartData({
        storeId,
        start,
        end,
        hour: dayjs(date).tz(TZ).hour(),
        totalRevenue: invoice.totalRevenue || 0,
        peopleCount: visitor.totalPeople || 0,
      });
      await this.syncTopProducts({topProductsData , storeId, start, end});
    } catch (err) {
      console.error("Error synchronizing daily summaries:", err);
    }
  },
  async syncKpis({ storeId, start, end, kpis }) {
    try {
      // Update hoặc tạo mới document
      const result = await StoreSummary.updateOne(
        { store_id: storeId, date: { $gte: start, $lte: end } },
        { $set: { kpis, updated_at: new Date() } },
        { upsert: true }
      );

      if (!result.acknowledged) throw new Error("Update KPIs failed");
    } catch (err) {
      throw err;
    }
  },

  async syncChartData({
    storeId,
    start,
    end,
    hour,
    peopleCount,
    totalRevenue,
  }) {
    try {
      const result = await StoreSummary.updateOne(
        {
          store_id: storeId,
          date: { $gte: start, $lte: end },
          "chart_data.hour": hour,
        },
        {
          $set: {
            "chart_data.$.people_count": peopleCount,
            "chart_data.$.total_revenue": totalRevenue,
          },
        }
      );
      if (result.matchedCount === 0) {
        // Nếu không có giờ nào khớp, thêm mới giờ đó vào mảng chart_data
        const pushResult = await StoreSummary.updateOne(
          { store_id: storeId, date: { $gte: start, $lte: end } },
          {
            $push: {
              chart_data: {
                hour,
                people_count: peopleCount,
                total_revenue: totalRevenue,
              },
            },
          },
          {
            _id : false,
          }
        );
      }
      if (!result.acknowledged) throw new Error("Update chart_data failed");
      return result;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
  async syncTopProducts({topProductsData , storeId, start, end}) {
    try {
      const result = await StoreSummary.updateOne(
        {
          store_id: storeId,
          date: { $gte: start, $lte: end },
        },
        {
          $set: {
            top_products: topProductsData,
          },
        }
      );
      if (!result.acknowledged) throw new Error("Update top_products failed");
    } catch (error) {
      throw error;
    }
  }
};

module.exports = synchronizeStoreData;
