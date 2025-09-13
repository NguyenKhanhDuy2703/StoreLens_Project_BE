const axiosInstance = require('./index')
const getTracking = async (timestamp) => {
    try{ 
        const response = await axiosInstance.get('/tracking_video',{
            params: { timestamp }
        });
        return response.data;
    }catch(error){
        console.error("Error posting tracking data:", error.data || error.message);
        throw error;
    }
}
module.exports = {getTracking}