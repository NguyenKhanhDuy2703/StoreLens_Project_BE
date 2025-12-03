const { getDateRangeVN } = require("../service/dashBoardService");
const storeModel = require("../schemas/store.model.js");
const zoneModel = require("../schemas/zone.model.js");
const personTrackingModel = require("../schemas/personTracking.model.js");
const invoiceModel = require("../schemas/invoice.model.js");
const zonesSummary = require("../schemas/zonesSummary.model.js");
const cameraModel = require("../schemas/camera.model.js");
const productModel = require("../schemas/products.model.js");

const isPointInPolygon = (point, vs) => {
  if (!point || point.length < 2) return false;
  let x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i][0],
      yi = vs[i][1];
    let xj = vs[j][0],
      yj = vs[j][1];
    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};
let zoneCache = {};
const ensureCache = (storeId, cameraCode, zoneId) => {
  if (!peopleInZoneStatus[storeId]) {
    peopleInZoneStatus[storeId] = {};
  }
  if (!peopleInZoneStatus[storeId][cameraCode]) {
    peopleInZoneStatus[storeId][cameraCode] = {};
  }
  if (!peopleInZoneStatus[storeId][cameraCode][zoneId]) {
    peopleInZoneStatus[storeId][cameraCode][zoneId] = {
      stopEvent: new Set(),
      entryTimes: new Set(),
    };
  }
};
const getZones = async (storeId) => {
  console.log("Fetching zones for store:", storeId);
  if (zoneCache[storeId]) {
    return zoneCache[storeId];
  }
  const cameraDocs = await zoneModel
    .find({ store_id: storeId })
    .select({
      _id: 0,
      camera_code: 1,
      "zones.zone_id": 1,
      "zones.coordinates": 1,
    })
    .lean();

  zoneCache[storeId] = cameraDocs.map((doc) => ({
    camera_code: doc.camera_code,
    zones: doc.zones.map((z) => ({
      zone_id: z.zone_id,
      coordinates: z.coordinates,
    })),
  }));

  return zoneCache[storeId];
};
const rtspCache = new Map();
const getCameraFromRTSP = async (rtspUrl) => {
  if (rtspCache.has(rtspUrl)) {
    return rtspCache.get(rtspUrl);
  }
  const camera = await cameraModel
    .findOne({ rtsp_url: rtspUrl })
    .select({ _id: 0, camera_code: 1, store_id: 1 })
    .lean();

  if (camera) {
    rtspCache.set(rtspUrl, camera);
  }
  return camera;
};
let peopleInZoneStatus = {};
const syncZonesData = {
  async processAsynZone({ storeid, date }) {
    try {
      const { start, end } = getDateRangeVN(date);
      const listProductForCategory = await invoiceModel.aggregate([
        {
          $match: {
            store_id: storeid,
            date: { $gte: start, $lte: end },
          },
        },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product_id",
            product_name: { $first: "$products.name_product" },
            total_quantity: { $sum: "$products.quantity" },
            total_revenue: { $sum: "$products.total_price" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "product_id",
            as: "product_info",
          },
        },
        {
          $unwind: {
            path: "$product_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            product_id: "$_id",
            product_name: 1,
            total_quantity: 1,
            total_revenue: 1,
            category_name: "$product_info.category_name",
          },
        },
      ]);
      const listZone = await zoneModel
        .find({ store_id: storeid })
        .select({ _id: 0, camera_code: 1, zones: 1 })
        .lean();
      const zoneInfoMap = new Map();
      for (const doc of listZone) {
        const cameraCode = doc.camera_code;
        if (doc.zones && Array.isArray(doc.zones)) {
          for (const z of doc.zones) {
            zoneInfoMap.set(z.zone_id, {
              camera_code: cameraCode,
              zone_id: z.zone_id,
              category_name: z.category_name,
            });
          }
        }
      }
      const zoneStats = {};

      for (const item of listProductForCategory) {
        if (!item.category_name) continue;
        for (const z of zoneInfoMap.values()) {
          if (item.category_name === z.category_name) {
            if (!zoneStats[z.zone_id]) {
              zoneStats[z.zone_id] = {
                totalSalesValue: item.total_revenue,
                totalInvoices: 1,
                camera_code: z.camera_code,
                zone_id: z.zone_id,
                category_name: z.category_name,
                topProduct: [
                  {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    total_quantity: item.total_quantity,
                    total_revenue: item.total_revenue,
                  },
                ],
              };
            } else {
              zoneStats[z.zone_id].totalSalesValue += item.total_revenue;
              zoneStats[z.zone_id].totalInvoices += 1;
              zoneStats[z.zone_id].topProduct.push({
                product_id: item.product_id,
                product_name: item.product_name,
                total_quantity: item.total_quantity,
                total_revenue: item.total_revenue,
              });
            }
          }
        }
      }
      await this.saveZoneSummary({ storeid, zoneStats, date });
    } catch (err) {
      console.error("Error in asyncZone:", err);
    }
  },
  async processPeopleInZones(data) {
    try {
      for (const record of data) {
        const { rtsp_url } = record;
        const CameraCode = await getCameraFromRTSP(rtsp_url);
        if (!zoneCache[CameraCode.store_id]) {
          zoneCache[CameraCode.store_id] = await getZones(CameraCode.store_id);
        }
        if (!CameraCode) {
          continue;
        }

        const zoneForCamera = zoneCache[CameraCode.store_id]?.find(
          (z) => z.camera_code === CameraCode.camera_code
        );
        if (!zoneForCamera) {
          continue;
        }

        for (const zoneItem of zoneForCamera.zones) {
          ensureCache(
            CameraCode.store_id,
            CameraCode.camera_code,
            zoneItem.zone_id
          );
          if (record.data != null || record.data != undefined) {
            for (const person of record.data) {
              const positions = person.position;
              if (positions.length === 0) continue;
              const isInZone = isPointInPolygon(
                positions,
                zoneItem.coordinates
              );
              const peopleSetEntryTime =
                peopleInZoneStatus[CameraCode.store_id][CameraCode.camera_code][
                  zoneItem.zone_id
                ]["entryTimes"];
              if (isInZone) {
                const checkExists = peopleSetEntryTime.has(person.track_id);
                if (!checkExists) {
                  peopleSetEntryTime.add(person.track_id);
                  console.log(
                    `Person ${person.track_id} entered zone ${zoneItem.zone_id}`
                  );
                  await this.updateZoneSummary({
                    storeId: CameraCode.store_id,
                    cameraCode: CameraCode.camera_code,
                    zoneId: zoneItem.zone_id,
                    date: new Date(),
                    peopleCount: 1,
                  });
                }
              }
              if (peopleSetEntryTime.size > 200) {
                let count = 0;
                for (const pid of peopleSetEntryTime) {
                  peopleSetEntryTime.delete(pid);
                  count++;
                  if (count >= 50) break;
                }
              }
            }
          } else {
            if (record.event != null || record.event != undefined) {
              if (record.event.event_type === "stop") {
                console.log(record.event);
              }
              const position = [
                record.event.x_position,
                record.event.y_position,
              ];
              const isInZone = isPointInPolygon(position, zoneItem.coordinates);
              if (isInZone) {
                const peopleSetStopEvent =
                  peopleInZoneStatus[CameraCode.store_id][
                    CameraCode.camera_code
                  ][zoneItem.zone_id]["stopEvent"];
                const checkExists = peopleSetStopEvent.has(
                  record.event.track_id
                );
                if (!checkExists) {
                  peopleSetStopEvent.add(record.event.track_id);
                  console.log(record.event);
                  await this.updateZoneSummary({
                    stopEvent: record.event,
                    stopEventCount: 1,
                    storeId: CameraCode.store_id,
                    cameraCode: CameraCode.camera_code,
                    zoneId: zoneItem.zone_id,
                    date: new Date(),
                    peopleCount: 0,
                  });
                }
              }
            }
          }
        }
      }
    } catch (err) {
      throw err;
    }
  },
  async updateZoneSummary({
    storeId,
    zoneId,
    date,
    peopleCount,
    cameraCode,
    stopEvent,
    stopEventCount,
  }) {
    try {
      const { start, end } = getDateRangeVN(date);
      const checkSummary = await zonesSummary.findOne({
        store_id: storeId,
        zone_id: zoneId,
        date: { $gte: start, $lte: end },
      });
      if (checkSummary) {
        const result = await zonesSummary.updateOne(
          {
            store_id: storeId,
            zone_id: zoneId,
            date: { $gte: start, $lte: end },
          },
          {
            $set: { updated_at: new Date() },
            $inc: {
              "performance.people_count": peopleCount,
              "performance.total_stop_time": stopEvent
                ? stopEvent.duration_s
                : 0,
              "performance.total_stop_events": stopEventCount
                ? stopEventCount
                : 0,
            },
          },
          { upsert: true }
        );
      } else {
        // Tạo mới bản ghi
        const newSummary = new zonesSummary({
          camera_code: cameraCode,
          store_id: storeId,
          zone_id: zoneId,
          date: new Date(),
          performance: {
            people_count: peopleCount ? peopleCount : 0,
            total_stop_time: stopEvent ? stopEvent.duration_s : 0,
            total_stop_events: stopEventCount ? stopEventCount : 0,
          },
          created_at: new Date(),
          updated_at: new Date(),
        });
        await newSummary.save();
      }
    } catch (err) {
      throw err;
    }
  },
  async saveZoneSummary({ storeid, zoneStats, date }) {
    try {
      const { start, end } = getDateRangeVN(date);
      for (const item of Object.values(zoneStats)) {
        const checkSummary = await zonesSummary.findOne({
          store_id: storeid,
          zone_id: item.zone_id,
          date: { $gte: start, $lte: end },
        });

        if (checkSummary) {
          await zonesSummary.updateOne(
            {
              store_id: storeid,
              zone_id: item.zone_id,
              date: { $gte: start, $lte: end },
            },
            [
              {
                $set: {
                  updated_at: new Date(),
                  "performance.total_sales_value": item.totalSalesValue, 
                  "performance.total_invoices": item.totalInvoices, 
                  "performance.top_product_id": {
                    $let: {
                      vars: {
                        sortedProducts: {
                          $sortArray: {
                            input: item.topProduct,
                            sortBy: { total_revenue: -1 },
                          },
                        },
                      },
                      in: {
                        $ifNull: [
                          { $arrayElemAt: ["$$sortedProducts.product_id", 0] },
                          null,
                        ],
                      },
                    },
                  },
                },
              },
              {
                $set: {
                  "performance.conversion_rate": {
                    $cond: [
                      {
                        $eq: [{ $ifNull: ["$performance.people_count", 0] }, 0],
                      },
                      0,
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$performance.total_invoices",
                              "$performance.people_count",
                            ],
                          },
                          100,
                        ],
                      },
                    ],
                  },
                  "performance.avg_dwell_time": {
                    $cond: [
                      {
                        $eq: [
                          { $ifNull: ["$performance.total_stop_events", 0] },
                          0,
                        ],
                      },
                      0,
                      {
                        $divide: [
                          "$performance.total_stop_time",
                          "$performance.total_stop_events",
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            { upsert: true }
          );
        } else {
          const newZoneSummary = new zonesSummary({
            camera_code: item.camera_code,
            store_id: storeid,
            zone_id: item.zone_id,
            date: new Date(),
            performance: {
              total_sales_value: item.totalSalesValue,
              total_invoices: item.totalInvoices,
              conversion_rate:
                item.totalInvoices >= 1 && item.people_count >= 1
                  ? (item.totalInvoices / item.people_count) * 100
                  : 0,
              avg_dwell_time: 0,
              top_product_id: item.topProduct.sort(
                (a, b) => b.total_revenue - a.total_revenue
              )[0].product_id,
            },
            created_at: new Date(),
            updated_at: new Date(),
          });
          await newZoneSummary.save();
        }
      }
    } catch (err) {
      throw err;
    }
  },
};
module.exports = syncZonesData;
