    const trackingRouter = require("./tracking.routes");
const dashboardRouter = require("./dashBoard.routes");
const heatmapRouter = require("./heatMap.routes");
const flowRouter = require("./flow.routes");
const cesRouter = require("./ces.routes");
const dwellTimeRouter = require("./dwellTime.routes");
const cameraZonesRouter = require("./cameraZones.route");
const dataSynchronizationRouter = require("./dataSynchronization.route");
const Routes = (app) => {
  app.use("/api/v1/tracking",trackingRouter);
  app.use("/api/v1/downtime", dwellTimeRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/heatmap", heatmapRouter);
  app.use("/api/v1/flow", flowRouter);
  app.use("/api/v1/ces", cesRouter);
  app.use("/api/v1/cameraZones", cameraZonesRouter);
  app.use("/api/v1/dataSynchronization" ,dataSynchronizationRouter );
  app.get("/api", (req, res) => {
    res.send("Welcome to the API");
  });
};
module.exports = Routes;
