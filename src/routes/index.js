const TrackingRouter = require("./Tracking")
const testRouter = require("./test")
const Routes = (app) => {
app.use('/api', TrackingRouter)
app.use('/api', testRouter)
app.get('/api', (req, res) => {
    res.send('Welcome to the API');
});
}
module.exports = Routes;