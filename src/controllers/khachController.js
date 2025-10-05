const personTracking = require("../schemas/personTracking.schema");
const mongoose = require("mongoose");

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

      // ✅ Tạo sessionId
      const sessionId = `session_${Date.now()}_${person_id}`;

      // ✅ Tạo bản ghi mới
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
        message: "✅ Khách đã check-in",
        data: newTrack,
      });
    } catch (err) {
      console.error("Check-in error:", err);
      res.status(500).json({ success: false, message: "Lỗi khi check-in khách", error: err.message });
    }
  },


  // Khách rời cửa hàng
  async checkOut(req, res) {
    try {
      const { person_id } = req.body;

      if (!person_id) {
        return res.status(400).json({ success: false, message: "Thiếu person_id để check-out" });
      }

      const track = await personTracking.findOneAndUpdate(
        { person_id, status: "active" },
        { status: "inactive", end_time: new Date(), updated_at: new Date() },
        { new: true }
      );

      if (!track) {
        return res.status(404).json({ success: false, message: "Không tìm thấy khách đang active để check-out" });
      }

      res.json({
        success: true,
        message: "✅ Khách đã rời cửa hàng",
        data: track
      });
    } catch (err) {
      console.error("Check-out error:", err);
      res.status(500).json({ success: false, message: "Lỗi check-out", error: err.message });
    }
  },

  // Lấy số lượng khách hiện tại trong cửa hàng
  async getActive(req, res) {
    try {
      const { store_id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(store_id)) {
        return res.status(400).json({ success: false, message: "store_id không hợp lệ" });
      }

      const active = await personTracking.find({
        store_id: new mongoose.Types.ObjectId(store_id),
        status: "active"
      });

      res.json({
        success: true,
        count: active.length,
        customers: active
      });
    } catch (err) {
      console.error("getActive error:", err);
      res.status(500).json({ success: false, message: "Lỗi getActive", error: err.message });
    }
  },
}
  

