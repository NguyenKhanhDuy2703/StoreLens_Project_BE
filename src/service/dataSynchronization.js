const { group } = require("console");
const personTrackingModel = require("../schemas/personTracking.schema.js");
// Nhiệm vụ ham này dông bộ dữ liệu giữa các dịch vụ nếu cần thiết cho collection dailySummaries
const synchronizeData = {
    // function async metrics
    async startSynchronization() {
        console.log("Data synchronization service started.");
        // Logic đồng bộ dữ liệu giữa các dịch vụ nếu cần thiết
    },
    async SynchoniztionMetrics(store_id , camera_id , range) {
        console.log("Synchronizing metrics data...");
        const totalPeople  = await personTrackingModel.countDocuments({
            date: {
                $gte: range.startDate,
                $lte: range.endDate
            }
        })
        const avgVisitDuration = await personTrackingModel.aggregate([
            {
                // match  là điều kiện => where in SQL 
            $match : {
                store_id : store_id,
                camera_id : camera_id,  
                date: {
                    $gte: range.startDate,
                    $lte: range.endDate
                }
            }
        },
           {
             $group : {
                _id : "person_id",
                totalDuration : {$sum : "$stop_events.duration_s"}
            }
           },
           {
            group : {
            _id : null,
            avgDuration : {$avg : "$totalDuration"}
           }
           }
        ])
        return {
            totalPeople : totalPeople,
            avgVisitDuration :avgVisitDuration
        }
    },
    async stopSynchronization() {
        console.log("Data synchronization service stopped.");
        // Logic dừng đồng bộ dữ liệu
    } 
};
module.exports = synchronizeData;