const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 5000;
const routes = require("./routes/index");
const { connectionMongo } = require("./config/mongoDB");
const corsOptions = {
  origin: ["http://localhost:5173", " http://172.20.176.1:5173"], // Đảm bảo URL này khớp với frontend của bạn
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Nếu bạn đang gửi cookie hoặc xác thực
};

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
// start routes
routes(app);

app.listen(port, () => {
  connectionMongo();
  console.log(`listening sucessful port ${port}`);
});
