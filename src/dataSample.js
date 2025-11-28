
const storeSummaryData = {
  date: new Date(),
  store_id: "STORE001",
  kpis: {
    total_visitors: 320,
    total_revenue: 15200000,
    total_invoices: 65,
    conversion_rate: 20.31,
    avg_store_dwell_time: 7.5,
    avg_basket_value: 233846
  },
  realtime: {
    people_current: 14,
    checkout_length: 3 
  },
  forecast: {
    peak_hour: 18
  },
  chart_data: [
    { hour: 9, people_count: 30, total_revenue: 1200000 },
    { hour: 10, people_count: 45, total_revenue: 2100000 },
    { hour: 11, people_count: 52, total_revenue: 2500000 },
    { hour: 12, people_count: 60, total_revenue: 2800000 }
  ],
  top_products: [
    { product_id: "P001", product_name: "Nước suối Lavie 500ml", total_quantity: 120, total_revenue: 720000, rank: 1 },
    { product_id: "P002", product_name: "Snack Oishi vị BBQ", total_quantity: 95, total_revenue: 950000, rank: 2 },
    { product_id: "P003", product_name: "Bia Tiger Lon", total_quantity: 80, total_revenue: 1360000, rank: 3 }
  ],
  created_at: new Date(),
  updated_at: new Date()
};
// const zoneSummariesData = [
//   {
//     date: new Date(),
//     store_id: "STORE001",
//     zone_id: "Z01",
//     camera_code: "C01",
//     category_name: "Khu đồ uống",
//     performance: {
//       people_count: 180,
//       total_sales_value: 4500000,
//       total_invoices: 40,
//       conversion_rate: 22.22,
//       avg_dwell_time: 3.1, 
//       total_stop_events: 150,
//       top_product_id: "P001",
//       peak_hour: 12
//     },
//     traffic_flow_timeline:[
//       { hour: 9, people_count: 20 },
//       { hour: 10, people_count: 35 },
//       { hour: 11, people_count: 40 },
//       { hour: 12, people_count: 50 },
//     ],
//     trend: "up",
//     created_at: new Date(),
//     updated_at: new Date()
//   },
//   {
//     date: new Date(),
//     store_id: "STORE001",
//     zone_id: "Z02",
//     camera_code: "C01",
//     category_name: "Khu mỹ phẩm",
//     performance: {
//       people_count: 95,
//       total_sales_value: 2100000,
//       total_invoices: 10,
//       conversion_rate: 10.53,
//       avg_dwell_time: 8.2, 
//       total_stop_events: 110,
//       top_product_id: "P105",
//       peak_hour: 19
//     },
//     trend: "down",
//     created_at: new Date(),
//     updated_at: new Date()
//   },
//   {
//     date: new Date(),
//     store_id: "STORE001",
//     zone_id: "Z03",
//     camera_code: "C01",
//     category_name: "Khu bánh kẹo",
//     performance: {
//       people_count: 150,
//       total_sales_value: 3200000,
//       total_invoices: 35,
//       conversion_rate: 23.33,
//       avg_dwell_time: 4.5, 
//       total_stop_events: 130,
//       top_product_id: "P002",
//       peak_hour: 16
//     },
//     traffic_flow_timeline:[
//       { hour: 9, people_count: 20 },
//       { hour: 10, people_count: 35 },
//       { hour: 11, people_count: 40 },
//       { hour: 12, people_count: 50 },
//     ],
//     trend: "steady",
//     created_at: new Date(),
//     updated_at: new Date()
//   },
//   {
//     date: new Date(),
//     store_id: "STORE001",
//     zone_id: "Z04",
//     camera_code: "C01",
//     category_name: "Khu thanh toán",
//     performance: {
//       people_count: 65,
//       total_sales_value: 15200000,
//       total_invoices: 65,
//       conversion_rate: 100.0,
//       avg_dwell_time: 4.1,
//       total_stop_events: 65,
//       top_product_id: null,
//       peak_hour: 18
//     },
//     traffic_flow_timeline:[
//       { hour: 9, people_count: 20 },
//       { hour: 10, people_count: 35 },
//       { hour: 11, people_count: 40 },
//       { hour: 12, people_count: 50 },
//     ],
//     trend: "up",
//     created_at: new Date(),
//     updated_at: new Date()
//   }
// ];

const now = new Date();

// Ngày Hôm Nay
const TODAY = new Date(now);

// Ngày Hôm Qua (Để test range="today" so với hôm qua)
const YESTERDAY = new Date(now);
YESTERDAY.setDate(now.getDate() - 1);

// 7 Ngày Trước (Để test range="7days" so với tuần trước)
const LAST_WEEK = new Date(now);
LAST_WEEK.setDate(now.getDate() - 7);

// ==========================================
// DỮ LIỆU ZONE SUMMARY
// ==========================================
const zoneSummariesData = [
  // ============================
  // 1. DỮ LIỆU HÔM NAY (TODAY)
  // ============================
  {
    date: TODAY,
    store_id: "STORE001",
    zone_id: "Z01",
    camera_code: "C01",
    category_name: "Khu đồ uống",
    performance: { people_count: 240, total_sales_value: 5400000, total_invoices: 58, conversion_rate: 24.1, total_stop_time: 630, total_stop_events: 190, avg_dwell_time: 2.2, top_product_id: "P001", peak_hour: 13 },
    trend: "up"
  },
  {
    date: TODAY,
    store_id: "STORE001",
    zone_id: "Z02",
    camera_code: "C01",
    category_name: "Khu mỹ phẩm",
    performance: { people_count: 140, total_sales_value: 3900000, total_invoices: 26, conversion_rate: 18.5, total_stop_time: 1300, total_stop_events: 145, avg_dwell_time: 17.0, top_product_id: "P105", peak_hour: 18 },
    trend: "up"
  },
  {
    date: TODAY,
    store_id: "STORE001",
    zone_id: "Z03",
    camera_code: "C01",
    category_name: "Khu bánh kẹo",
    performance: { people_count: 165, total_sales_value: 3600000, total_invoices: 38, conversion_rate: 23.0, total_stop_time: 610, total_stop_events: 135, avg_dwell_time: 5.2, top_product_id: "P002", peak_hour: 15 },
    trend: "steady"
  },
  {
    date: TODAY,
    store_id: "STORE001",
    zone_id: "Z04",
    camera_code: "C01",
    category_name: "Khu thanh toán",
    performance: { people_count: 75, total_sales_value: 17000000, total_invoices: 75, conversion_rate: 100.0, total_stop_time: 310, total_stop_events: 75, avg_dwell_time: 4.0, top_product_id: null, peak_hour: 19 },
    trend: "up"
  },
  {
    date: TODAY,
    store_id: "STORE001",
    zone_id: "Z05",
    camera_code: "C02",
    category_name: "Khu thực phẩm tươi sống",
    performance: { people_count: 240, total_sales_value: 7600000, total_invoices: 55, conversion_rate: 22.9, total_stop_time: 830, total_stop_events: 175, avg_dwell_time: 6.1, top_product_id: "P350", peak_hour: 9 },
    trend: "up"
  },

  // ============================
  // 2. DỮ LIỆU HÔM QUA (YESTERDAY)
  // (Dùng để so sánh cho Today)
  // ============================
  {
    date: YESTERDAY,
    store_id: "STORE001",
    zone_id: "Z01", // Đồ uống hôm qua thấp hơn -> Hôm nay tăng (Xanh)
    category_name: "Khu đồ uống",
    camera_code: "C01",
    performance: { people_count: 100, total_sales_value: 2000000, total_invoices: 20, conversion_rate: 20.0, total_stop_time: 300, total_stop_events: 80, avg_dwell_time: 1.8, top_product_id: "P001", peak_hour: 12 },
    trend: "steady"
  },
  {
    date: YESTERDAY,
    store_id: "STORE001",
    zone_id: "Z02", // Mỹ phẩm hôm qua cao hơn -> Hôm nay giảm (Đỏ) - Ví dụ thế
    category_name: "Khu mỹ phẩm",
    camera_code: "C01",
    performance: { people_count: 150, total_sales_value: 4500000, total_invoices: 30, conversion_rate: 20.0, total_stop_time: 1400, total_stop_events: 160, avg_dwell_time: 18.5, top_product_id: "P105", peak_hour: 18 },
    trend: "steady"
  },
  // (Tạo thêm data cho các zone khác của ngày hôm qua nếu cần...)
  {
    date: YESTERDAY,
    store_id: "STORE001",
    zone_id: "Z03",
    camera_code: "C01",
    category_name: "Khu bánh kẹo",
    performance: { people_count: 140, total_sales_value: 3000000, total_invoices: 30, conversion_rate: 21.0, total_stop_time: 500, total_stop_events: 120, avg_dwell_time: 4.8, top_product_id: "P002", peak_hour: 16 },
    trend: "steady"
  },
  {
    date: YESTERDAY,
    store_id: "STORE001",
    zone_id: "Z04",
    camera_code: "C01",
    category_name: "Khu thanh toán",
    performance: { people_count: 60, total_sales_value: 14000000, total_invoices: 60, conversion_rate: 100.0, total_stop_time: 250, total_stop_events: 60, avg_dwell_time: 3.8, top_product_id: null, peak_hour: 17 },
    trend: "steady"
  },
  {
    date: YESTERDAY,
    store_id: "STORE001",
    zone_id: "Z05",
    camera_code: "C02",
    category_name: "Khu thực phẩm tươi sống",
    performance: { people_count: 200, total_sales_value: 6000000, total_invoices: 40, conversion_rate: 20.0, total_stop_time: 700, total_stop_events: 150, avg_dwell_time: 5.0, top_product_id: "P350", peak_hour: 10 },
    trend: "steady"
  },


  // ============================
  // 3. DỮ LIỆU 7 NGÀY TRƯỚC (LAST WEEK)
  // (Dùng để so sánh cho 7days)
  // ============================
  {
    date: LAST_WEEK,
    store_id: "STORE001",
    zone_id: "Z01",
    camera_code: "C01",
    category_name: "Khu đồ uống",
    performance: { people_count: 190, total_sales_value: 4500000, total_invoices: 40, conversion_rate: 21.0, total_stop_time: 580, total_stop_events: 150, avg_dwell_time: 3.6, top_product_id: "P001", peak_hour: 11 },
    trend: "steady"
  },
  {
    date: LAST_WEEK,
    store_id: "STORE001",
    zone_id: "Z02",
    camera_code: "C01",
    category_name: "Khu mỹ phẩm",
    performance: { people_count: 115, total_sales_value: 2300000, total_invoices: 12, conversion_rate: 10.4, total_stop_time: 900, total_stop_events: 105, avg_dwell_time: 8.4, top_product_id: "P105", peak_hour: 20 },
    trend: "steady"
  },
  {
    date: LAST_WEEK,
    store_id: "STORE001",
    zone_id: "Z03",
    camera_code: "C01",
    category_name: "Khu bánh kẹo",
    performance: { people_count: 150, total_sales_value: 3100000, total_invoices: 32, conversion_rate: 21.3, total_stop_time: 590, total_stop_events: 128, avg_dwell_time: 4.4, top_product_id: "P002", peak_hour: 16 },
    trend: "up"
  },
  {
    date: LAST_WEEK,
    store_id: "STORE001",
    zone_id: "Z04",
    camera_code: "C01",
    category_name: "Khu thanh toán",
    performance: { people_count: 63, total_sales_value: 15000000, total_invoices: 63, conversion_rate: 100.0, total_stop_time: 260, total_stop_events: 63, avg_dwell_time: 3.9, top_product_id: null, peak_hour: 17 },
    trend: "steady"
  },
  {
    date: LAST_WEEK,
    store_id: "STORE001",
    zone_id: "Z05",
    camera_code: "C02",
    category_name: "Khu thực phẩm tươi sống",
    performance: { people_count: 210, total_sales_value: 6800000, total_invoices: 42, conversion_rate: 20.2, total_stop_time: 720, total_stop_events: 155, avg_dwell_time: 4.9, top_product_id: "P350", peak_hour: 10 },
    trend: "down"
  }
];
const camerasData = [
  {
    store_id: "STORE001",
    camera_name: "Camera 01",
    camera_code: "C01",
    rtsp_url: "rtsp://admin:password@192.168.1.10:554/cam/01",
    camera_spec: {
      max_resolution: { width: 1920, height: 1080 },
      current_resolution: { width: 1280, height: 720 }
    },
    camera_state: {
      last_processed_time: new Date("2025-10-13T08:00:00.000Z"),
      last_stop_time: new Date("2025-10-13T08:10:00.000Z")
    },
    status: "active",
    last_heartbeat: new Date("2025-10-13T08:20:00.000Z"),
    installation_date: new Date("2025-09-01T00:00:00.000Z"),
    created_at: new Date("2025-10-13T08:00:00.000Z"),
    updated_at: new Date("2025-10-13T08:00:00.000Z")
  },
  {
    store_id: "STORE001",
    camera_name: "Camera 02",
    camera_code: "C02",
    rtsp_url: "rtsp://admin:password@192.168.1.10:554/cam/02",
    camera_spec: {
      max_resolution: { width: 1920, height: 1080 },
      current_resolution: { width: 1280, height: 720 }
    },
    camera_state: {
      last_processed_time: new Date("2025-10-13T08:05:00.000Z"),
      last_stop_time: new Date("2025-10-13T08:15:00.000Z")
    },
    status: "active",
    last_heartbeat: new Date("2025-10-13T08:22:00.000Z"),
    installation_date: new Date("2025-09-03T00:00:00.000Z"),
    created_at: new Date("2025-10-13T08:05:00.000Z"),
    updated_at: new Date("2025-10-13T08:05:00.000Z")
  },
  {
    store_id: "STORE001",
    camera_name: "Camera 03",
    camera_code: "C03",
    rtsp_url: "rtsp://admin:password@192.168.1.10:554/cam/03",
    camera_spec: {
      max_resolution: { width: 2560, height: 1440 },
      current_resolution: { width: 1920, height: 1080 }
    },
    camera_state: {
      last_processed_time: new Date("2025-10-13T08:03:00.000Z"),
      last_stop_time: new Date("2025-10-13T08:18:00.000Z")
    },
    status: "inactive",
    last_heartbeat: new Date("2025-10-13T08:18:30.000Z"),
    installation_date: new Date("2025-09-05T00:00:00.000Z"),
    created_at: new Date("2025-10-13T08:03:00.000Z"),
    updated_at: new Date("2025-10-13T08:10:00.000Z")
  },
  {
    store_id: "STORE001",
    camera_name: "Camera 04",
    camera_code: "C04",
    rtsp_url: "rtsp://admin:password@192.168.1.10:554/cam/04",
    camera_spec: {
      max_resolution: { width: 3840, height: 2160 },
      current_resolution: { width: 1920, height: 1080 }
    },
    camera_state: {
      last_processed_time: new Date("2025-10-13T08:12:00.000Z"),
      last_stop_time: new Date("2025-10-13T08:25:00.000Z")
    },
    status: "active",
    last_heartbeat: new Date("2025-10-13T08:25:30.000Z"),
    installation_date: new Date("2025-09-07T00:00:00.000Z"),
    created_at: new Date("2025-10-13T08:12:00.000Z"),
    updated_at: new Date("2025-10-13T08:12:00.000Z")
  }
];
const ZonesData = [
  {
    store_id: "STORE001",
    camera_code: "C01",
    background_image: "https://example.com/bg_C01.jpg",
    width_frame: 1920,
    height_frame: 1080,
    zones: [
      {
        zone_id: "C01_Z1",
        zone_name: "Entrance Zone",
        coordinates: [
          [100, 200],
          [300, 200],
          [300, 400],
          [100, 400]
        ],
        color: "#FF0000",
        category_name: "Entrance"
      },
      {
        zone_id: "C01_Z2",
        zone_name: "Promo Shelf",
        coordinates: [
          [400, 150],
          [600, 150],
          [600, 350],
          [400, 350]
        ],
        color: "#00FF00",
        category_name: "Promotions"
      }
    ]
  },
  {
    store_id: "STORE001",
    camera_code: "C02",
    background_image: "https://example.com/bg_C02.jpg",
    width_frame: 1920,
    height_frame: 1080,
    zones: [
      {
        zone_id: "C02_Z1",
        zone_name: "Checkout Counter",
        coordinates: [
          [50, 500],
          [300, 500],
          [300, 800],
          [50, 800]
        ],
        color: "#0000FF",
        category_name: "Checkout"
      }
    ]
  },
  {
    store_id: "STORE001",
    camera_code: "C03",
    background_image: "https://example.com/bg_C03.jpg",
    width_frame: 2560,
    height_frame: 1440,
    zones: [
      {
        zone_id: "C03_Z1",
        zone_name: "Snacks Shelf",
        coordinates: [
          [800, 300],
          [1100, 300],
          [1100, 550],
          [800, 550]
        ],
        color: "#FFA500",
        category_name: "Snacks"
      },
      {
        zone_id: "C03_Z2",
        zone_name: "Beverage Corner",
        coordinates: [
          [1200, 300],
          [1500, 300],
          [1500, 600],
          [1200, 600]
        ],
        color: "#00FFFF",
        category_name: "Beverages"
      }
    ]
  },
  {
    store_id: "STORE001",
    camera_code: "C04",
    background_image: "https://example.com/bg_C04.jpg",
    width_frame: 3840,
    height_frame: 2160,
    zones: [
      {
        zone_id: "C04_Z1",
        zone_name: "High-value Products",
        coordinates: [
          [200, 400],
          [600, 400],
          [600, 900],
          [200, 900]
        ],
        color: "#FF69B4",
        category_name: "High-value"
      }
    ]
  }
];


module.exports = {
  storeSummaryData,
  zoneSummariesData,
  camerasData,
  ZonesData
};