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
      // 1. Kiểm tra store tồn tại
      const storeExists = await storeModel.exists({ store_id: storeId });
      if (!storeExists) throw new Error(`Store ID ${storeId} does not exist.`);

      const { start, end } = getDateRangeVN(date);

      // 2. Lấy dữ liệu visitor (PersonTracking)
      // Mặc định là 0 để tránh lỗi nếu chưa có khách
      let visitor = { visitorCount: 0, totalStopEvents: 0, avgDurationS: 0 };

      const visitorData = await personTrackingModel.aggregate([
        {
          $match: {
            store_id: storeId,
            date: { $gte: start, $lte: end },
          },
        },
        {
          $project: {
            person_id: 1,
            events: { $ifNull: ["$stop_events", []] },
          },
        },
        {
          $group: {
            _id: null,
            uniquePeople: { $addToSet: "$person_id" },
            totalDwellTime: { $sum: { $sum: "$events.duration_s" } },
            totalStopCount: { $sum: { $size: "$events" } },
          },
        },
        {
          $project: {
            _id: 0,
            visitorCount: { $size: "$uniquePeople" },
            totalStopEvents: "$totalStopCount",
            avgDurationS: {
              $cond: [
                { $eq: [{ $size: "$uniquePeople" }, 0] },
                0,
                { $divide: ["$totalDwellTime", { $size: "$uniquePeople" }] },
              ],
            },
          },
        },
      ]);

      if (visitorData.length > 0) {
        visitor = visitorData[0];
      }

      // 3. Lấy dữ liệu invoice (Doanh thu)
      // Mặc định là 0 để tránh lỗi nếu chưa có đơn hàng
      let invoice = { totalRevenue: 0, totalInvoices: 0 };

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

      if (invoiceData.length > 0) {
        invoice = invoiceData[0];
      }

      // 4. Khởi tạo StoresSummary nếu chưa có
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

      // 5. Tính toán KPIs
      const kpis = {
        total_visitors: visitor.visitorCount,
        total_revenue: invoice.totalRevenue,
        total_invoices: invoice.totalInvoices,
        conversion_rate: visitor.visitorCount
          ? Number(((invoice.totalInvoices / visitor.visitorCount) * 100).toFixed(2))
          : 0,
        // Giữ nguyên giá trị đã tính trung bình từ aggregate
        avg_store_dwell_time: Number(visitor.avgDurationS.toFixed(2)) || 0,
        avg_basket_value: invoice.totalInvoices
          ? Number((invoice.totalRevenue / invoice.totalInvoices).toFixed(2))
          : 0,
      };

      // 6. Lấy Top Products
      const topProductsData = await InvoiceModel.aggregate([
        {
          $match: {
            store_id: storeId,
            date: { $gte: start, $lte: end },
          },
        },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product_id",
            product_name: { $first: "$products.name_product" },
            total_quantity: { $sum: "$products.quantity" },
            total_revenue: { $sum: "$products.total_price" },
          },
        },
        { $sort: { total_revenue: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            product_id: "$_id",
            product_name: 1,
            total_quantity: 1,
            total_revenue: 1,
          },
        },
      ]);

      // 7. Đồng bộ dữ liệu
      await this.syncKpis({ storeId, start, end, kpis });
      
      await this.syncChartData({
        storeId,
        start,
        end,
        hour: dayjs(date).tz(TZ).hour(),
        totalRevenue: invoice.totalRevenue,
        // FIX: Sửa visitor.totalPeople (undefined) thành visitor.visitorCount
        peopleCount: visitor.visitorCount, 
      });

      await this.syncTopProducts({ topProductsData, storeId, start, end });

    } catch (err) {
      console.error("Error synchronizing daily summaries:", err);
    }
  },

  async syncKpis({ storeId, start, end, kpis }) {
    try {
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

  async syncChartData({ storeId, start, end, hour, peopleCount, totalRevenue }) {
    try {
      // Cập nhật nếu giờ đã tồn tại
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

      // Nếu chưa có giờ này trong mảng, push mới vào
      if (result.matchedCount === 0) {
        await StoreSummary.updateOne(
          { store_id: storeId, date: { $gte: start, $lte: end } },
          {
            $push: {
              chart_data: {
                hour,
                people_count: peopleCount,
                total_revenue: totalRevenue,
              },
            },
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  async syncTopProducts({ topProductsData, storeId, start, end }) {
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
  },
};

module.exports = synchronizeStoreData;