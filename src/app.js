const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 5000;
const routes = require("./routes/index");
const { connectionMongo } = require("./config/mongoDB");
const { connectRedis } = require("./config/redis");
const { startTrackingAI } = require("./workers/trackingWorker");
const corsOptions = {
  origin: ["http://localhost:5173", " http://172.20.176.1:5173"], // Đảm bảo URL này khớp với frontend của bạn
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Nếu bạn đang gửi cookie hoặc xác thực
};

const app = express();
app.use(morgan("dev"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true  , limit: '50mb'}));

app.use(cors(corsOptions));
app.use(cookieParser());
// start routes
routes(app);
const initSystem = async () => {
  try {
    await connectRedis();
    await connectionMongo();
    startTrackingAI();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

app.listen(port, () => {
  initSystem();
  console.log(`listening sucessful port ${port}`);
});
