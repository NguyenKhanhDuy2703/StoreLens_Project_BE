const TrackingRouter = require("./Tracking")
const khachRouter = require("./khach.router") 
const visitRouter = require("./visit.router")
const trend7Day = require("./trend7Day.router")



const Routes = (app) => {
    app.use('/api', TrackingRouter)


    app.use('/api/khach', khachRouter) 
    app.use('/api/visit', visitRouter)
    app.use('/api/trend', trend7Day)
}
module.exports = Routes;