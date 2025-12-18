const {redisClient}  = require("../config/redis");
const QUEUE_NAME_TRACKING = "storelens:tracking_queue";
const QUEUE_NAME_STOP_EVENT = "storelens:events_queue";
const QUEUE_NAME_HEATMAP = "storelens:heatmap_queue";
const BATCH_SIZE = 20;
const PROCESSING_INTERVAL = 2000; 
const PROCESSING_INTERVAL_HEATMAP = 5000;
const personTrackingService = require("../service_AI/personTrackingService");
const syncZonesData = require("../service/dataSyncZones");
const startTrackingAI = async () => {
  try {
    setInterval( async () => {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const trackingLength = await redisClient.lLen(QUEUE_NAME_TRACKING);
      const stopEventLength = await redisClient.lLen(QUEUE_NAME_STOP_EVENT);
      if(trackingLength > 0){
        const batchSize = Math.min(BATCH_SIZE, trackingLength);
        const rawListString =  await redisClient.lPop(QUEUE_NAME_TRACKING , batchSize); 
        let data = []
        if (!rawListString ){
          return;
        }else if (Array.isArray( rawListString )){
          data = rawListString.map( item => JSON.parse(item) );
        }else {
          data.push( JSON.parse( rawListString ) );
        }
        if(data.length >0){
          personTrackingService.saveDataTracking( data );
          syncZonesData.processPeopleInZones(data);
        }
      }
      if(stopEventLength > 0){
        const batchSize = Math.min(BATCH_SIZE, stopEventLength);
        const rawListString = await redisClient.lPop(QUEUE_NAME_STOP_EVENT , batchSize);
        let data = []
        if (!rawListString ){
          return;
        }else if (Array.isArray( rawListString )){
          data = rawListString.map( item => JSON.parse(item) );
        }else {
          data.push( JSON.parse(rawListString));
        }
        if(data.length >0){
          personTrackingService.saveStopEvent( data );
          syncZonesData.processPeopleInZones(data);
        }
      }
     
    },PROCESSING_INTERVAL,)
    setInterval( async () => {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const heatmapLength = await redisClient.lLen(QUEUE_NAME_HEATMAP);
      if(heatmapLength > 0){
        const batchSize = Math.min(BATCH_SIZE, heatmapLength);
        const rawListString = await redisClient.lPop(QUEUE_NAME_HEATMAP , batchSize);
        let data = []
        
        if (!rawListString ){
          return;
        }else if (Array.isArray( rawListString )){
          data = rawListString.map( item => JSON.parse(item) );
        }else {
          data.push( JSON.parse( rawListString ) );
        }
        if(data.length >0){
          personTrackingService.saveHeatmap( data );
        }
      }
    },PROCESSING_INTERVAL_HEATMAP)

  } catch (error) {
    console.error("Error processing tracking data:", error);
  }
};

module.exports = {
  startTrackingAI,
};