const TrackingRouter = require("./Tracking")
const khachRouter = require("./khach.router") 
const visitRouter = require("./visit.router")
const trend7Day = require("./trend7Day.router")
const dashboardTrendRouter = require("./dashboardTrend.router");



const Routes = (app) => {
    app.use('/api', TrackingRouter)


    app.use('/api/khach', khachRouter) 
    app.use('/api/visit', visitRouter)
    app.use('/api/trend', trend7Day)
    app.use('/api/dashboardTrend', dashboardTrendRouter);
}
module.exports = Routes;