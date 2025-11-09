
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
const zoneSummariesData = [
  {
    date: new Date(),
    store_id: "STORE001",
    zone_id: "Z01",
    camera_code: "C01",
    category_name: "Khu đồ uống",
    performance: {
      people_count: 180,
      total_sales_value: 4500000,
      total_invoices: 40,
      conversion_rate: 22.22,
      avg_dwell_time: 3.1, 
      total_stop_events: 150,
      top_product_id: "P001",
      peak_hour: 12
    },
    trend: "up",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    date: new Date(),
    store_id: "STORE001",
    zone_id: "Z02",
    camera_code: "C01",
    category_name: "Khu mỹ phẩm",
    performance: {
      people_count: 95,
      total_sales_value: 2100000,
      total_invoices: 10,
      conversion_rate: 10.53,
      avg_dwell_time: 8.2, 
      total_stop_events: 110,
      top_product_id: "P105",
      peak_hour: 19
    },
    trend: "down",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    date: new Date(),
    store_id: "STORE001",
    zone_id: "Z03",
    camera_code: "C01",
    category_name: "Khu bánh kẹo",
    performance: {
      people_count: 150,
      total_sales_value: 3200000,
      total_invoices: 35,
      conversion_rate: 23.33,
      avg_dwell_time: 4.5, 
      total_stop_events: 130,
      top_product_id: "P002",
      peak_hour: 16
    },
    trend: "steady",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    date: new Date(),
    store_id: "STORE001",
    zone_id: "Z04",
    camera_code: "C01",
    category_name: "Khu thanh toán",
    performance: {
      people_count: 65,
      total_sales_value: 15200000,
      total_invoices: 65,
      conversion_rate: 100.0,
      avg_dwell_time: 4.1,
      total_stop_events: 65,
      top_product_id: null,
      peak_hour: 18
    },
    trend: "up",
    created_at: new Date(),
    updated_at: new Date()
  }
];
module.exports = {
  storeSummaryData,
  zoneSummariesData
};