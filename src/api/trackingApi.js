const axiosInstance = require('./index')
const getTracking = async ( url_rtsp) => {
    try{ 
        const response = await axiosInstance.get('/tracking_video',{
            params: {url_rtsp : url_rtsp}
        });
        return response.data;
    }catch(error){
        console.error("Error posting tracking data:", error.data || error.message);
        throw error;
    }
}
const stopTracking = async () => {
    try {
        const response = await axiosInstance.get('/stop_tracking');
        return response.data;
    } catch (error) {
        console.error("Error stopping tracking:", error.data || error.message);
        throw error;
    }
}
const getDataFromTracking = async () => {
    try{
        const response = await axiosInstance.get('/data_tracking');
        return response.data;   
    }catch(error){
        console.error("Error getting tracking data:", error.data || error.message);
        throw error;
    }
}
module.exports = {getTracking  , stopTracking , getDataFromTracking}