const trackingRouter = require("./tracking.routes");
const dashboardRouter = require("./dashBoard.routes");
const dwellTimeRouter = require("./dwellTime.routes");
const cameraZonesRouter = require("./cameraZones.route");
const dataSynchronizationRouter = require("./dataSynchronization.route");
const loginRouter = require("./login.routes");
const heatmapRouter = require("./heatmap.route");
const { authenticationToken, authenticatioRole } = require("../middlewares/authentication");
const Routes = (app) => {
  app.use("/api/v1/tracking",trackingRouter);
  app.use("/api/v1/downtime", dwellTimeRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/cameraZones", cameraZonesRouter);
  app.use("/api/v1/heatmap", heatmapRouter);
  app.use("/api/v1/dataSynchronization" ,dataSynchronizationRouter );
  app.use("/api/v1/auth", loginRouter);
  app.get(
    "/api/v1/getToken",
    authenticationToken,
    authenticatioRole(["admin","manager"]), 
    (req, res) => {
      res.status(200).json({
        user: req.data,
      });
    }
  );
  app.get("/api", (req, res) => {
    res.send("Welcome to the API");
  });
};
module.exports = Routes;
