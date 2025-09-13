const TrackingRouter = require("./Tracking")
const testRouter = require("./test")
const Routes = (app) => {
app.use('/api', TrackingRouter)
app.use('/api', testRouter)
}
module.exports = Routes;