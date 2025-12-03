const { Worker } = require('worker_threads');
const path = require('path');

exports.importInvoices = (req, res) => {
  // 1. Kiểm tra file
  if (!req.file) {
    return res.status(400).json({ message: "Vui lòng upload file Excel" });
  }

  // 2. Khởi tạo Worker
  const workerPath = path.resolve(__dirname, '../workers/importInvoiceWorker.js');
  
  const worker = new Worker(workerPath, {
    workerData: {
      filePath: req.file.path, // Đường dẫn file vừa upload
      storeId: req.body.store_id, // Truyền store_id
      // Truyền chuỗi kết nối DB để Worker tự connect (Lấy từ biến môi trường của Main Thread)
      mongoURI: "mongodb+srv://truongthanhdat:truongthanhdat@cluster0.v5l4v9l.mongodb.net/storelens?retryWrites=true&w=majority&appName=Cluster0"
    }
  });

  // 3. Lắng nghe sự kiện từ Worker
  
  // Khi Worker làm xong và gửi tin nhắn về
  worker.on('message', (result) => {
    if (result.success) {
      res.status(200).json({
        message: "Import thành công (Xử lý bởi Worker Threads)",
        count: result.count
      });
    } else {
      res.status(500).json({
        message: "Lỗi trong quá trình xử lý",
        error: result.error
      });
    }
  });

  // Khi Worker bị lỗi crash
  worker.on('error', (err) => {
    console.error("Worker Error:", err);
    res.status(500).json({ message: "Lỗi Worker", error: err.message });
  });

  // Khi Worker kết thúc (Exit code khác 0 là lỗi)
  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
  

};