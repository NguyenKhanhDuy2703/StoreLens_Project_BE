const TrackingRouter = require("./Tracking")
const Routes = (app) => {
app.use('/api', TrackingRouter)
app.get('/api', (req, res) => {
    res.send('Welcome to the API');
});
module.exports = Routes;