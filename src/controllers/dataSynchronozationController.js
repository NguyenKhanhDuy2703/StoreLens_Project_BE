const synchronizeStoreData = require("../service/dataSyncStores");
const syncZonesData  = require ("../service/dataSyncZones")
const {getDateRangeVN} = require("../utils/tranformHoursVN");
const dataSynchronizationController = async (req, res) => {
    try {
        const { storeId, date = new Date() } = req.query;
        if (!storeId || !date) {
            return res.status(400).json({
                message: "Missing required query parameters: storeId and date",
            });
        }
       
        await synchronizeStoreData.syncBatchDailySummaries({ storeId, date});
        res.status(200).json({
            message: "Data synchronization completed successfully",
        });
    }
    catch (error) {
        console.error("Error in dataSynchronizationController:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}
const dataSynchronizationRealTimeController = async (req, res) => {
    try {
        const { storeId, date = new Date() } = req.query;
        if (!storeId || !date) {
            return res.status(400).json({
                message: "Missing required query parameters: storeId and date",
            });
        }
        await synchronizeStoreData.syncRealTimeDailySummaries({ storeId, date });
        res.status(200).json({
            message: "Real-time data synchronization completed successfully",
        });
    }
    catch (error) {
        console.error("Error in dataSynchronizationRealTimeController:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}
const dataSynchronizationZoneController = async (req, res) => {
    try{
        const { storeId, date  } = req.query;
        if (!storeId || !date) {
            return res.status(400).json({
                message: "Missing required query parameters: storeId and date",
            });
        }
        const { start, end } = getDateRangeVN(date);
        await syncZonesData.processAsynZone({storeid: storeId , start , end});
      
        res.status(200).json({
            message: "Zone data synchronization completed successfully",
        });
    }catch (error) {
        console.error("Error in dataSynchronizationZoneController:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}
module.exports = {
    dataSynchronizationController ,
    dataSynchronizationZoneController
};
