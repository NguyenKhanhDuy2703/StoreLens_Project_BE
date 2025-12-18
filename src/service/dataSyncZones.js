const { getDateRangeVN } = require("../utils/tranformHoursVN");
const zoneModel = require("../schemas/zone.model.js");
const invoiceModel = require("../schemas/invoice.model.js");
const zonesSummary = require("../schemas/zonesSummary.model.js");
const cameraModel = require("../schemas/camera.model.js");
const isPointInPolygon = require("../utils/isPointInPolygon");
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
      "zones.category_name": 1,
    })
    .lean();

  zoneCache[storeId] = cameraDocs.map((doc) => ({
    camera_code: doc.camera_code,
    zones: doc.zones.map((z) => ({
      zone_id: z.zone_id,
      coordinates: z.coordinates,
      category_name: z.category_name,
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
// Object Đồng bộ dữ liệu zones
const syncZonesData = {
  async processAsynZone({ storeid, start , end }) {
    try {
      
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
            _id: {
              product_id: "$products.product_id",
              invoice_id: "$_id",
            },
            product_name: { $first: "$products.name_product" },
            total_quantity: { $sum: "$products.quantity" },
            total_revenue: { $sum: "$products.total_price" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id.product_id",
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
            product_id: "$_id.product_id",
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
      // Tạo map để tra cứu nhanh zone theo category_name
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
          if (z.category_name == null) continue;
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
      await this.saveZoneSummary({
        storeid,
        start,
        end,
        zoneStats,
      });
    } catch (err) {
      console.error("Error in asyncZone:", err);
    }
  },
  async processPeopleInZones(data) {
  try {
    for (const record of data) {
      const { rtsp_url } = record;
      const CameraCode = await getCameraFromRTSP(rtsp_url);
      if (!CameraCode) continue;

      if (!zoneCache[CameraCode.store_id]) {
        zoneCache[CameraCode.store_id] = await getZones(CameraCode.store_id);
      }
      
      const zoneForCamera = zoneCache[CameraCode.store_id]?.find(
        (z) => z.camera_code === CameraCode.camera_code
      );
      
      if (!zoneForCamera) continue;

      for (const zoneItem of zoneForCamera.zones) {
        ensureCache(
          CameraCode.store_id,
          CameraCode.camera_code,
          zoneItem.zone_id,
          zoneItem.category_name
        );

        // --- 1. XỬ LÝ NGƯỜI VÀO VÙNG (Tracking) ---
        if (record.data && Array.isArray(record.data)) {
          for (const person of record.data) {
            const positions = person.position;
            if (!positions || positions.length === 0) continue;

            const isInZone = isPointInPolygon(positions, zoneItem.coordinates);
            
            if (isInZone) {
              const peopleSetEntryTime = peopleInZoneStatus[CameraCode.store_id]
                [CameraCode.camera_code][zoneItem.zone_id]["entryTimes"];
              
              const checkExists = peopleSetEntryTime.has(person.track_id);
              if (!checkExists) {
                peopleSetEntryTime.add(person.track_id);

                await this.updateZoneSummary({
                  storeId: CameraCode.store_id,
                  cameraCode: CameraCode.camera_code,
                  zoneId: zoneItem.zone_id,
                  categoryName: zoneItem.category_name,
                  date: new Date(),
                  peopleCount: 1,
                });
              }

              // Cleanup bộ nhớ
              if (peopleSetEntryTime.size > 200) {
                const iterator = peopleSetEntryTime.values();
                let count = 0;
                while(count < 50) {
                  peopleSetEntryTime.delete(iterator.next().value);
                  count++;
                }
              }
            }
          }
        }

        // --- 2. XỬ LÝ SỰ KIỆN DỪNG (Stop Event) ---
        if (record.event && record.event.event_type === "stop") {
        
          const position = [
            record.event.x_position,
            record.event.y_position,
          ];
          const isInZone = isPointInPolygon(position, zoneItem.coordinates);
          if (isInZone) {
            const peopleSetStopEvent = peopleInZoneStatus[CameraCode.store_id]
              [CameraCode.camera_code][zoneItem.zone_id]["stopEvent"];
              
            const checkExists = peopleSetStopEvent.has(record.event.track_id);
            
            if (!checkExists) {
              peopleSetStopEvent.add(record.event.track_id);
              
              await this.updateZoneSummary({
                stopEvent: record.event,
                stopEventCount: 1,
                storeId: CameraCode.store_id,
                categoryName: zoneItem.category_name,
                cameraCode: CameraCode.camera_code,
                zoneId: zoneItem.zone_id,
                date: new Date(),
                peopleCount: 0,
              });
            }
            
            // Cleanup bộ nhớ cho stopEvent
            if (peopleSetStopEvent.size > 200) {
               const iterator = peopleSetStopEvent.values();
               let count = 0;
               while(count < 50) {
                 peopleSetStopEvent.delete(iterator.next().value);
                 count++;
               }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error in processPeopleInZones:", err); 
    throw err;
  }
},
  // hàm cập nhật dữ liệu vào zonesSummary
 async updateZoneSummary({
    storeId,
    zoneId,
    date,
    peopleCount = 0,
    cameraCode,
    stopEvent,
    stopEventCount = 0,
    categoryName,
  }) {
    try {
      const { start, end } = getDateRangeVN(date);
      const incStopTime = stopEvent ? stopEvent.duration_s : 0;
      const incStopEvents = stopEventCount || 0;

      const checkSummary = await zonesSummary.findOne({
        store_id: storeId,
        zone_id: zoneId,
        date: { $gte: start, $lte: end },
      });

      if (checkSummary) {
        await zonesSummary.updateOne(
          {
            store_id: storeId,
            zone_id: zoneId,
            date: { $gte: start, $lte: end },
          },
          [
            {
              $set: {
                updated_at: new Date(),
                category_name: categoryName,
                // Cộng dồn các chỉ số (tương đương $inc cũ)
                "performance.people_count": {
                  $add: [{ $ifNull: ["$performance.people_count", 0] }, peopleCount],
                },
                "performance.total_stop_time": {
                  $add: [{ $ifNull: ["$performance.total_stop_time", 0] }, incStopTime],
                },
                "performance.total_stop_events": {
                  $add: [{ $ifNull: ["$performance.total_stop_events", 0] }, incStopEvents],
                },
              },
            },
            {
              // Tính toán lại trung bình dựa trên giá trị vừa cộng
              $set: {
                "performance.avg_dwell_time": {
                  $cond: [
                    { $eq: ["$performance.total_stop_events", 0] },
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
          ]
        );
      } else {
        const initialStopTime = stopEvent ? stopEvent.duration_s : 0;
        const initialStopEvents = stopEventCount || 0;
        const initialAvg = initialStopEvents > 0 ? initialStopTime / initialStopEvents : 0;

        const newSummary = new zonesSummary({
          camera_code: cameraCode,
          store_id: storeId,
          zone_id: zoneId,
          date: new Date(),
          category_name: categoryName,
          performance: {
            people_count: peopleCount || 0,
            total_stop_time: initialStopTime,
            total_stop_events: initialStopEvents,
            avg_dwell_time: initialAvg, 
            total_sales_value: 0,
            total_invoices: 0,
            conversion_rate: 0,
          },
          created_at: new Date(),
          updated_at: new Date(),
        });
        await newSummary.save();
      }
    } catch (err) {
      console.error("Error in updateZoneSummary:", err);
      throw err;
    }
  },
  async saveZoneSummary({ storeid, zoneStats, start , end }) {
    try {
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
                   category_name: item.category_name,
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
            category_name: item.category_name,
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
