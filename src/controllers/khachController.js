const personTracking = require("../schemas/personTracking.schema");
const Store = require("../schemas/store.schema");
const mongoose = require("mongoose");
const moment = require("moment");

module.exports = {
  // Khách vào cửa hàng
  async checkIn(req, res) {
    try {
      const { store_id, camera_id, person_id } = req.body;

      //Kiểm tra dữ liệu bắt buộc
      if (!store_id) {
        return res.status(400).json({ success: false, message: "Thiếu store_id (cửa hàng)" });
      }
      if (!camera_id) {
        return res.status(400).json({ success: false, message: "Thiếu camera_id" });
      }
      if (!person_id) {
        return res.status(400).json({ success: false, message: "Thiếu person_id (khách hàng)" });
      }

      // Kiểm tra ID có hợp lệ dạng ObjectId không
      if (!mongoose.Types.ObjectId.isValid(store_id)) {
        return res.status(400).json({ success: false, message: "store_id không hợp lệ" });
      }
      if (!mongoose.Types.ObjectId.isValid(camera_id)) {
        return res.status(400).json({ success: false, message: "camera_id không hợp lệ" });
      }

      // Tạo sessionId
      const sessionId = `session_${Date.now()}_${person_id}`;

      // Tạo bản ghi mới
      const newTrack = new personTracking({
        store_id: new mongoose.Types.ObjectId(store_id),
        camera_id: new mongoose.Types.ObjectId(camera_id),
        person_id,
        session_id: sessionId,
        status: "active",
        start_time: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      await newTrack.save();

      res.status(201).json({
        success: true,
        message: "Khách đã check-in",
        data: newTrack,
      });
    } catch (err) {
      console.error("Check-in error:", err);
      res.status(500).json({ success: false, message: "Lỗi khi check-in khách", error: err.message });
    }
  },


  async checkOut(req, res) {
    try {
      const { store_id, camera_id, person_id } = req.body;
      // Kiểm tra dữ liệu 
      if (!person_id)
        return res.status(400).json({ success: false, message: "Thiếu person_id để check-out" });
      if (!store_id)
        return res.status(400).json({ success: false, message: "Thiếu store_id (cửa hàng)" });
      if (camera_id && !mongoose.isValidObjectId(camera_id))
        return res.status(400).json({ success: false, message: "camera_id không hợp lệ" });

      const track = await personTracking.findOneAndUpdate(
        { person_id, store_id, status: "active" },
        { status: "inactive", end_time: new Date(), updated_at: new Date() },
        { new: true }
      );

      if (!track)
        return res.status(404).json({ success: false, message: "Không tìm thấy khách đang active để check-out" });

      res.json({
        success: true,
        message: "Khách đã rời cửa hàng",
        data: track
      });
    } catch (err) {
      console.error("Check-out error:", err);
      res.status(500).json({ success: false, message: "Lỗi check-out", error: err.message });
    }
  },

  // Thống kê khách hôm nay
  async getTodayData(req, res) {
    try {
      const { store_id } = req.params;

      // Kiểm tra dữ liệu đầu vào 
      if (!store_id) return res.status(400).json({ success: false, message: "Thiếu ID cửa hàng" });

      // Kiểm tra cửa hàng có tồn tại không 
      const store = await Store.findById(store_id);
      if (!store) return res.status(404).json({ success: false, message: "Không tìm thấy cửa hàng" });
      // Kiểm tra ID có hợp lệ dạng ObjectId không
      if (!mongoose.Types.ObjectId.isValid(store_id)) {
        return res.status(400).json({ success: false, message: "store_id không hợp lệ" });
      }

      // Lấy dữ liệu thống kê hôm nay
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();

      const checkins = await personTracking.countDocuments({  //lấy số lượng khách vào
        store_id,
        start_time: { $gte: startOfDay, $lte: endOfDay },
      });

      const checkouts = await personTracking.countDocuments({ //lấy số lượng khách ra
        store_id,
        end_time: { $gte: startOfDay, $lte: endOfDay },
      });

      res.json({
        success: true,
        data: { checkin: checkins, checkout: checkouts },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Lỗi thống kê hôm nay", error: err.message });
    }
  },

  // Lấy thông tin khách đang active
  async getActive(req, res) {
    try {
      const { store_id } = req.params;

      // Tạo điều kiện tìm kiếm 
      let matchCondition = { status: "active" };

      if (store_id) {
        // Kiểm tra hợp lệ ID cửa hàng
        if (!mongoose.Types.ObjectId.isValid(store_id)) {
          return res.status(400).json({
            success: false,
            message: "store_id không hợp lệ",
          });
        }

        // Kiểm tra cửa hàng có tồn tại
        const store = await Store.findById(store_id);
        if (!store) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy cửa hàng",
          });
        }

        // Gán điều kiện cho truy vấn
        matchCondition.store_id = new mongoose.Types.ObjectId(store_id);
      }

      // Tổng khách active theo điều kiện (toàn hệ thống / cửa hàng)
      const totalActive = await personTracking.countDocuments(matchCondition);

      // Dữ liệu chi tiết khách của cửa hàng nếu có
      const customers = store_id
        ? await personTracking.find(matchCondition).select("person_id start_time camera_id")
        : [];

      // Thống kê toàn bộ cửa hàng
      const allStoresData = await personTracking.aggregate([
        { $match: { status: "active" } },  //đk chỉ lấy khách active
        {
          $group: {   //nhóm theo cửa hàng
            _id: "$store_id",
            totalActive: { $sum: 1 },
          },
        },
        {
          $lookup: {  //nối với bảng cửa hàng để lấy tên
            from: "stores",
            localField: "_id",
            foreignField: "_id",
            as: "storeInfo",
          },
        },
        { $unwind: { path: "$storeInfo", preserveNullAndEmptyArrays: true } }, //nếu ko có cửa hàng thì vẫn hiển thị  
        {
          $project: {  //chọn trường để hiển thị
            _id: 0, 
            store_id: "$_id",
            store_name: "$storeInfo.name",
            totalActive: 1,
          },
        },
        { $sort: { totalActive: -1 } }, //sắp xếp giảm dần theo số khách
      ]);

      // Top 3 cửa hàng đông khách nhất
      const topStores = allStoresData.slice(0, 3);

      // Nếu có store_id, tìm thông tin của cửa hàng đó
      let storeSummary = null;
      if (store_id) {
        storeSummary =
          allStoresData.find((s) => s.store_id?.toString() === store_id) || {
            store_id,
            store_name: (await Store.findById(store_id))?.name || "Chưa rõ",
            totalActive: 0,
          };  //nếu k có khách thì vẫn hiển thị cửa hàng với totalActive = 0, k có store_name thì hiện "Chưa rõ"
      } 

      // Nếu dữ liệu trống thì báo rõ ràng
      if (!totalActive && !allStoresData.length) {
        return res.json({
          success: true,
          message: "Hiện không có khách nào đang trong cửa hàng",
          summary: { totalActive: 0, totalStores: 0 },
          topStores: [],
          storeSummary,
          customers: [],
        });
      }

      //Trả kết quả
      res.json({
        success: true,
        summary: {
          totalActive,
          totalStores: allStoresData.length || 1,
        },
        topStores,
        storeSummary,
        customers,
      });
    } catch (err) {
      console.error("getActive error:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi getActive",
        error: err.message,
      });
    }
  },

}