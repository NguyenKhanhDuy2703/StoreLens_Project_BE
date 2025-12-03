const { parentPort, workerData } = require('worker_threads');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Invoices = require('../schemas/invoice.model');
const fs = require('fs');

const connectDB = async () => {
    try {
        console.log("🔍 [WORKER] Bắt đầu kết nối DB...");
        // 1. In ra chuỗi kết nối (Đã che mật khẩu để bảo mật khi nhìn log)
        const maskedURI = workerData.mongoURI.replace(/:([^:@]+)@/, ':****@');
        console.log(`🔍 [WORKER] URI nhận được: ${maskedURI}`);

        await mongoose.connect(workerData.mongoURI);
        
        // 2. QUAN TRỌNG: In ra tên Database thực tế mà nó đã kết nối
        console.log(`✅ [WORKER] Đã kết nối thành công!`);
        console.log(`👉 [WORKER] Tên Database đang dùng: "${mongoose.connection.name}"`);
        console.log(`👉 [WORKER] Host: ${mongoose.connection.host}`);
        
    } catch (err) {
        console.error("❌ [WORKER] Lỗi kết nối DB:", err.message);
        parentPort.postMessage({ success: false, error: "DB Connection Failed: " + err.message });
        process.exit(1);
    }
};

const processExcel = async () => {
    await connectDB();

    try {
        // Kiểm tra xem Model sẽ lưu vào Collection tên gì
        console.log(`👉 [WORKER] Model 'Invoices' sẽ lưu vào Collection tên là: "${Invoices.collection.name}"`);

        const filePath = workerData.filePath;
        const workbook = xlsx.readFile(filePath, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`📊 [WORKER] Đọc được ${rawData.length} dòng từ Excel.`);

        const invoicesMap = new Map();

        rawData.forEach((row) => {
             const invoiceCode = row['Mã HĐ'] || row['invoice_code']; 
             if (!invoiceCode) return;
       
             if (!invoicesMap.has(invoiceCode)) {
               invoicesMap.set(invoiceCode, {
                 invoice_code: String(invoiceCode),
                 store_id: String(row['Mã Cửa Hàng'] || workerData.storeId),
                 total_amount: 0,
                 payment_method: row['PTTT'] || 'cash',
                 status: 'completed',
                 date: row['Ngày Bán'] ? new Date(row['Ngày Bán']) : new Date(),
                 products: [] 
               });
             }
       
             const currentInvoice = invoicesMap.get(invoiceCode);
             const itemTotal = row['Thành Tiền'] ? Number(row['Thành Tiền']) : (Number(row['Số Lượng']) * Number(row['Đơn Giá']));

             currentInvoice.products.push({
               product_id: String(row['Mã SP'] || 'UNKNOWN'),
               name_product: String(row['Tên SP'] || ''),
               quantity: Number(row['Số Lượng']) || 0,
               unit_price: Number(row['Đơn Giá']) || 0,
               total_price: itemTotal
             });
             
             currentInvoice.total_amount += itemTotal;
        });

        const finalInvoices = Array.from(invoicesMap.values());
        console.log(`📦 [WORKER] Đã gom thành ${finalInvoices.length} hóa đơn. Đang lưu vào DB...`);

        if (finalInvoices.length > 0) {
            const result = await Invoices.insertMany(finalInvoices, { ordered: false });
            console.log(`✅ [WORKER] Lưu thành công ${result.length} bản ghi vào Collection "${Invoices.collection.name}"`);
        } else {
             console.log(`⚠️ [WORKER] Không có dữ liệu để lưu.`);
        }

        fs.unlinkSync(filePath);

        parentPort.postMessage({ 
            success: true, 
            count: finalInvoices.length 
        });

    } catch (error) {
        console.error("❌ [WORKER] Lỗi xử lý:", error);
        parentPort.postMessage({ success: false, error: error.message });
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
};

processExcel();