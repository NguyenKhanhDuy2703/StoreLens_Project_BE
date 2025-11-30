const { getDateRangeVN } = require("../service/dashBoardService");
const storeModel = require("../schemas/store.model.js");
const zoneModel = require("../schemas/zone.model.js");
const personTrackingModel = require("../schemas/personTracking.model.js");
const invoiceModel = require("../schemas/invoice.model.js");
const zonesSummary = require("../schemas/zonesSummary.model.js");

// Hàm kiểm tra điểm trong đa giác
const isPointInPolygon = (point, vs) => {
    // point: [x, y], vs: [[x, y], [x, y], ...]
    if (!point || point.length < 2) return false;
    
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];
        let intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

const syncZonesData = {
    async asyncZone({ storeid, date }) {
        try {
            const { start, end } = getDateRangeVN(date);
            const zonesDocs = await zoneModel.find({ store_id: storeid }).lean();
            if (!zonesDocs.length) return;
            const dataTracking = await personTrackingModel.find({
                store_id: storeid,
                date: { $gte: start, $lte: end },
                camera_code : { $exists: true , $ne: null}
            }).lean();
            if (!dataTracking.length) return;
            const activeCameraId = new Set(dataTracking.map(item => item.camera_code));
            console.log("Active Cameras: ", activeCameraId);
            const zoneDocs = zonesDocs.filter(zone => activeCameraId.has(zone.camera_code));
            console.log("Zones to process: ", zoneDocs);
            for (const zone of zoneDocs) {
                let peopleCount = 0;
                let totalDwellTime = 0;
                let totalStopEvents = 0;
                for (const person of dataTracking){
                    
                }
            }


        } catch (err) {
            console.error("Error in asyncZone:", err);
        }
    }
}
module.exports = syncZonesData;