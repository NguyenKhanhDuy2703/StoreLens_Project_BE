const TrackingRouter = require("./Tracking")
const dashboardRouter= require("./dashboard")
const heatmapRouter= require("./heatmap")
const flowRouter= require("./flow")
const cesRouter= require("./ces")
const Routes = (app) => {
app.use('/api', TrackingRouter)
app.get('/api', (req, res) => {
    res.send('Welcome to the API');
});
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/heatmap", heatmapRouter)
app.use("/api/v1/flow", flowRouter)
app.use("/api/v1/ces", cesRouter)
}
module.exports = Routes;