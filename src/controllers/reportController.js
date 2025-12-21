
const reportService = require('../service/reportService');

const exportStoreReport = async (req, res) => {
    try {
        console.log("📥 [Controller] Nhận request export:", req.body);

        // 1. Lấy dữ liệu an toàn (Chấp nhận cả storeId và store_id)
        const storeId = req.body.storeId || req.body.store_id;
        const range = req.body.range;
        const reportConfig = req.body.reportConfig;
        
        // Lấy thông tin quản lý (nếu FE gửi thiếu thì dùng default)
        const managerName = req.body.managerName || "Quản lý";
        const storeAddress = req.body.storeAddress || "Chưa cập nhật";

        // Kiểm tra bắt buộc
        if (!storeId) {
            console.error("❌ [Controller] Thiếu storeId!");
            return res.status(400).json({ message: "Thiếu ID cửa hàng (storeId)" });
        }

        // 2. Gọi Service
        const workbook = await reportService.generateReportWorkbook(
            storeId,
            { range },
            reportConfig,
            { managerName, storeAddress }
        );

        if (!workbook) {
            return res.status(404).json({ message: "Không tạo được dữ liệu báo cáo" });
        }

        // 3. Trả về file Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=BaoCao_${storeId}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
        console.log("✅ [Controller] Xuất file thành công!");

    } catch (error) {
        console.error("❌ [Controller] Lỗi server:", error);
        res.status(500).json({ message: error.message || "Lỗi hệ thống khi xuất báo cáo" });
    }
};

module.exports = { exportStoreReport };