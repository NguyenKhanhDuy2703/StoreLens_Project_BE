const TrackingRouter = require("./Tracking")

const dashboardRouter = require("./DashboardRoutes")
const heatmapRouter = require("./HeatMapRoutes")
const flowRouter = require("./FlowRoutes")
const cesRouter = require("./CESRoutes")
const downtimeRouter = require("./CESRoutes")


const Routes = (app) => {
    app.use("/api/v1/downtime", downtimeRouter);
    app.use("/api/v1/dashboard", dashboardRouter)
    app.use("/api/v1/heatmap", heatmapRouter)
    app.use("/api/v1/flow", flowRouter)
    app.use("/api/v1/ces", cesRouter)


}
module.exports = Routes;