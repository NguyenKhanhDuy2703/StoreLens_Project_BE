const TrackingRouter = require("./Tracking")

const dashboardRouter = require("./dashboard")
const heatmapRouter = require("./heatmap")
const flowRouter = require("./flow")
const cesRouter = require("./ces")

const khachRouter = require("./khach.router")
const visitRouter = require("./visit.router")
const trend7Day = require("./trend7Day.router")



const Routes = (app) => {
    app.use('/api', TrackingRouter)
    app.use('/api/khach', khachRouter)
    app.use('/api/visit', visitRouter)
    app.use('/api/trend', trend7Day)
    app.use("/api/v1/dashboard", dashboardRouter)
    app.use("/api/v1/heatmap", heatmapRouter)
    app.use("/api/v1/flow", flowRouter)
    app.use("/api/v1/ces", cesRouter)

}
module.exports = Routes;