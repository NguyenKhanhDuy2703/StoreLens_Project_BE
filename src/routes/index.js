const TrackingRouter = require("./Tracking")
const testRouter = require("./test")
const dashboardRouter= require("./dashboard")
const heatmapRouter= require("./heatmap")

const Routes = (app) => {

app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/heatmap", heatmapRouter)

}
module.exports = Routes;