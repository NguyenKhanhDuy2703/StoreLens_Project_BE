const invoicesData = [
  // HÓA ĐƠN 1: Mua đồ ăn vặt buổi sáng
  {
    invoice_code: "INV-270125-001",
    store_id: "STORE001",
    total_amount: 186000,
    payment_method: "cash",
    status: "completed",
    products: [
      {
        product_id: "PRD-001",
        name_product: "Mì Hảo Hảo Tôm Chua Cay",
        quantity: 5,
        unit_price: 4500,
        total_price: 22500
      },
      {
        product_id: "PRD-002",
        name_product: "Nước Ngọt Pepsi 1.5L",
        quantity: 3,
        unit_price: 14000,
        total_price: 42000
      },
      {
        product_id: "PRD-003",
        name_product: "Trứng Gà V.L 10 Quả",
        quantity: 1,
        unit_price: 38000,
        total_price: 38000
      },
      {
        product_id: "PRD-020",
        name_product: "Snack Poca Khoai Tây",
        quantity: 8,
        unit_price: 8000,
        total_price: 64000
      },
      {
        product_id: "PRD-014",
        name_product: "Trà Xanh Không Độ 450ml",
        quantity: 2,
        unit_price: 9000,
        total_price: 18000
      }
    ],
    date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },

  // HÓA ĐƠN 2: Mua snack và sữa chua
  {
    invoice_code: "INV-270125-002",
    store_id: "STORE001",
    total_amount: 95000,
    payment_method: "momo",
    status: "completed",
    products: [
      {
        product_id: "PRD-004",
        name_product: "Bánh Gạo One One",
        quantity: 2,
        unit_price: 18000,
        total_price: 36000
      },
      {
        product_id: "PRD-005",
        name_product: "Sữa Chua Vinamilk Lốc 4",
        quantity: 2,
        unit_price: 14500,
        total_price: 29000
      },
      {
        product_id: "PRD-006",
        name_product: "Snack Oishi Cay",
        quantity: 2,
        unit_price: 15000,
        total_price: 30000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-27T10:15:00"),
    updated_at: new Date("2025-01-27T10:15:00")
  },

  // HÓA ĐƠN 3: Mua nguyên liệu nấu ăn
  {
    invoice_code: "INV-270125-003",
    store_id: "STORE001",
    total_amount: 325000,
    payment_method: "banking",
    status: "completed",
    products: [
      {
        product_id: "PRD-007",
        name_product: "Gạo ST25 5kg",
        quantity: 1,
        unit_price: 180000,
        total_price: 180000
      },
      {
        product_id: "PRD-008",
        name_product: "Dầu Ăn Neptune Light 1L",
        quantity: 2,
        unit_price: 52000,
        total_price: 104000
      },
      {
        product_id: "PRD-009",
        name_product: "Đường Tinh Luyện Biên Hòa 1kg",
        quantity: 1,
        unit_price: 41000,
        total_price: 41000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-27T14:20:00"),
    updated_at: new Date("2025-01-27T14:20:00")
  },

  // HÓA ĐƠN 4: Mua đồ uống buổi chiều
  {
    invoice_code: "INV-270125-004",
    store_id: "STORE001",
    total_amount: 67000,
    payment_method: "cash",
    status: "completed",
    products: [
      {
        product_id: "PRD-013",
        name_product: "Nước Ngọt Coca Cola 1.5L",
        quantity: 2,
        unit_price: 14000,
        total_price: 28000
      },
      {
        product_id: "PRD-015",
        name_product: "Sting Dâu 330ml",
        quantity: 3,
        unit_price: 8500,
        total_price: 25500
      },
      {
        product_id: "PRD-016",
        name_product: "Nước Suối Lavie 1.5L",
        quantity: 2,
        unit_price: 7000,
        total_price: 14000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-27T16:45:00"),
    updated_at: new Date("2025-01-27T16:45:00")
  },

  // HÓA ĐƠN 5: Mua gia vị và nước mắm
  {
    invoice_code: "INV-270125-005",
    store_id: "STORE001",
    total_amount: 144000,
    payment_method: "momo",
    status: "completed",
    products: [
      {
        product_id: "PRD-025",
        name_product: "Nước Mắm Nam Ngư 650ml",
        quantity: 2,
        unit_price: 38000,
        total_price: 76000
      },
      {
        product_id: "PRD-027",
        name_product: "Tương Ớt Cholimex 250ml",
        quantity: 2,
        unit_price: 18000,
        total_price: 36000
      },
      {
        product_id: "PRD-028",
        name_product: "Bột Ngọt Ajinomoto 400g",
        quantity: 1,
        unit_price: 28000,
        total_price: 28000
      },
      {
        product_id: "PRD-029",
        name_product: "Muối I-ốt 500g",
        quantity: 1,
        unit_price: 8000,
        total_price: 8000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-27T18:10:00"),
    updated_at: new Date("2025-01-27T18:10:00")
  },

  // HÓA ĐƠN 6: Mua mì gói số lượng lớn
  {
    invoice_code: "INV-280125-001",
    store_id: "STORE001",
    total_amount: 178000,
    payment_method: "banking",
    status: "completed",
    products: [
      {
        product_id: "PRD-001",
        name_product: "Mì Hảo Hảo Tôm Chua Cay",
        quantity: 10,
        unit_price: 4500,
        total_price: 45000
      },
      {
        product_id: "PRD-010",
        name_product: "Mì Kokomi Tôm",
        quantity: 12,
        unit_price: 3800,
        total_price: 45600
      },
      {
        product_id: "PRD-011",
        name_product: "Mì Omachi Xào Bò",
        quantity: 8,
        unit_price: 6000,
        total_price: 48000
      },
      {
        product_id: "PRD-012",
        name_product: "Mì 3 Miền Tôm Chua Cay",
        quantity: 7,
        unit_price: 5200,
        total_price: 36400
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-28T09:00:00"),
    updated_at: new Date("2025-01-28T09:00:00")
  },

  // HÓA ĐƠN 7: Mua sữa và bánh kẹo
  {
    invoice_code: "INV-280125-002",
    store_id: "STORE001",
    total_amount: 126500,
    payment_method: "cash",
    status: "completed",
    products: [
      {
        product_id: "PRD-021",
        name_product: "Sữa Tươi Vinamilk 1L",
        quantity: 2,
        unit_price: 32000,
        total_price: 64000
      },
      {
        product_id: "PRD-018",
        name_product: "Kẹo Alpenliebe Sữa",
        quantity: 1,
        unit_price: 28000,
        total_price: 28000
      },
      {
        product_id: "PRD-019",
        name_product: "Bánh Oreo Socola",
        quantity: 3,
        unit_price: 12000,
        total_price: 36000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-28T11:30:00"),
    updated_at: new Date("2025-01-28T11:30:00")
  },

  // HÓA ĐƠN 8: Mua gạo và thực phẩm chính
  {
    invoice_code: "INV-280125-003",
    store_id: "STORE001",
    total_amount: 462000,
    payment_method: "banking",
    status: "completed",
    products: [
      {
        product_id: "PRD-023",
        name_product: "Gạo Jasmine Nàng Hoa 5kg",
        quantity: 2,
        unit_price: 95000,
        total_price: 190000
      },
      {
        product_id: "PRD-024",
        name_product: "Gạo Thơm Thiên Long 5kg",
        quantity: 1,
        unit_price: 110000,
        total_price: 110000
      },
      {
        product_id: "PRD-003",
        name_product: "Trứng Gà V.L 10 Quả",
        quantity: 2,
        unit_price: 38000,
        total_price: 76000
      },
      {
        product_id: "PRD-017",
        name_product: "Trứng Gà CP 10 Quả",
        quantity: 2,
        unit_price: 35000,
        total_price: 70000
      },
      {
        product_id: "PRD-016",
        name_product: "Nước Suối Lavie 1.5L",
        quantity: 2,
        unit_price: 7000,
        total_price: 14000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-28T13:45:00"),
    updated_at: new Date("2025-01-28T13:45:00")
  },

  // HÓA ĐƠN 9: Mua đồ vệ sinh nhà cửa
  {
    invoice_code: "INV-280125-004",
    store_id: "STORE001",
    total_amount: 265000,
    payment_method: "momo",
    status: "completed",
    products: [
      {
        product_id: "PRD-032",
        name_product: "Nước Rửa Chén Sunlight 750g",
        quantity: 2,
        unit_price: 42000,
        total_price: 84000
      },
      {
        product_id: "PRD-033",
        name_product: "Nước Lau Sàn Vim 900ml",
        quantity: 2,
        unit_price: 38000,
        total_price: 76000
      },
      {
        product_id: "PRD-034",
        name_product: "Nước Giặt OMO Matic 3.8kg",
        quantity: 1,
        unit_price: 185000,
        total_price: 185000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-28T15:20:00"),
    updated_at: new Date("2025-01-28T15:20:00")
  },

  // HÓA ĐƠN 10: Mua đồ vệ sinh cá nhân
  {
    invoice_code: "INV-280125-005",
    store_id: "STORE001",
    total_amount: 172000,
    payment_method: "cash",
    status: "completed",
    products: [
      {
        product_id: "PRD-035",
        name_product: "Kem Đánh Răng P/S 230g",
        quantity: 2,
        unit_price: 35000,
        total_price: 70000
      },
      {
        product_id: "PRD-036",
        name_product: "Dầu Gội Clear Men 630ml",
        quantity: 1,
        unit_price: 125000,
        total_price: 125000
      },
      {
        product_id: "PRD-037",
        name_product: "Xà Phòng Lifebouy 90g",
        quantity: 3,
        unit_price: 12000,
        total_price: 36000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-28T17:50:00"),
    updated_at: new Date("2025-01-28T17:50:00")
  },

  // HÓA ĐƠN 11: Mua thực phẩm đóng hộp
  {
    invoice_code: "INV-290125-001",
    store_id: "STORE001",
    total_amount: 214000,
    payment_method: "banking",
    status: "completed",
    products: [
      {
        product_id: "PRD-030",
        name_product: "Cá Hộp Vissan 155g",
        quantity: 4,
        unit_price: 22000,
        total_price: 88000
      },
      {
        product_id: "PRD-031",
        name_product: "Thịt Hộp Spam 340g",
        quantity: 1,
        unit_price: 85000,
        total_price: 85000
      },
      {
        product_id: "PRD-009",
        name_product: "Đường Tinh Luyện Biên Hòa 1kg",
        quantity: 1,
        unit_price: 41000,
        total_price: 41000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-29T08:15:00"),
    updated_at: new Date("2025-01-29T08:15:00")
  },

  // HÓA ĐƠN 12: Mua combo gia vị đầy đủ
  {
    invoice_code: "INV-290125-002",
    store_id: "STORE001",
    total_amount: 238000,
    payment_method: "momo",
    status: "completed",
    products: [
      {
        product_id: "PRD-008",
        name_product: "Dầu Ăn Neptune Light 1L",
        quantity: 2,
        unit_price: 52000,
        total_price: 104000
      },
      {
        product_id: "PRD-025",
        name_product: "Nước Mắm Nam Ngư 650ml",
        quantity: 2,
        unit_price: 38000,
        total_price: 76000
      },
      {
        product_id: "PRD-026",
        name_product: "Mắm Tôm Huế 500g",
        quantity: 1,
        unit_price: 32000,
        total_price: 32000
      },
      {
        product_id: "PRD-022",
        name_product: "Sữa Đặc Ông Thọ 380g",
        quantity: 1,
        unit_price: 26000,
        total_price: 26000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-29T10:40:00"),
    updated_at: new Date("2025-01-29T10:40:00")
  },

  // HÓA ĐƠN 13: Mua đồ ăn vặt cho tiệc
  {
    invoice_code: "INV-290125-003",
    store_id: "STORE001",
    total_amount: 283000,
    payment_method: "cash",
    status: "completed",
    products: [
      {
        product_id: "PRD-004",
        name_product: "Bánh Gạo One One",
        quantity: 5,
        unit_price: 18000,
        total_price: 90000
      },
      {
        product_id: "PRD-006",
        name_product: "Snack Oishi Cay",
        quantity: 6,
        unit_price: 15000,
        total_price: 90000
      },
      {
        product_id: "PRD-020",
        name_product: "Snack Poca Khoai Tây",
        quantity: 10,
        unit_price: 8000,
        total_price: 80000
      },
      {
        product_id: "PRD-018",
        name_product: "Kẹo Alpenliebe Sữa",
        quantity: 1,
        unit_price: 28000,
        total_price: 28000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-29T14:25:00"),
    updated_at: new Date("2025-01-29T14:25:00")
  },

  // HÓA ĐƠN 14: Mua combo nước giải khát lớn
  {
    invoice_code: "INV-290125-004",
    store_id: "STORE001",
    total_amount: 189500,
    payment_method: "banking",
    status: "completed",
    products: [
      {
        product_id: "PRD-002",
        name_product: "Nước Ngọt Pepsi 1.5L",
        quantity: 5,
        unit_price: 14000,
        total_price: 70000
      },
      {
        product_id: "PRD-013",
        name_product: "Nước Ngọt Coca Cola 1.5L",
        quantity: 5,
        unit_price: 14000,
        total_price: 70000
      },
      {
        product_id: "PRD-014",
        name_product: "Trà Xanh Không Độ 450ml",
        quantity: 4,
        unit_price: 9000,
        total_price: 36000
      },
      {
        product_id: "PRD-016",
        name_product: "Nước Suối Lavie 1.5L",
        quantity: 2,
        unit_price: 7000,
        total_price: 14000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-29T16:55:00"),
    updated_at: new Date("2025-01-29T16:55:00")
  },

  // HÓA ĐƠN 15: Mua hàng buổi tối
  {
    invoice_code: "INV-290125-005",
    store_id: "STORE001",
    total_amount: 157500,
    payment_method: "momo",
    status: "completed",
    products: [
      {
        product_id: "PRD-005",
        name_product: "Sữa Chua Vinamilk Lốc 4",
        quantity: 3,
        unit_price: 14500,
        total_price: 43500
      },
      {
        product_id: "PRD-019",
        name_product: "Bánh Oreo Socola",
        quantity: 6,
        unit_price: 12000,
        total_price: 72000
      },
      {
        product_id: "PRD-015",
        name_product: "Sting Dâu 330ml",
        quantity: 5,
        unit_price: 8500,
        total_price: 42000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-29T19:30:00"),
    updated_at: new Date("2025-01-29T19:30:00")
  },

  // HÓA ĐƠN 16: Mua gạo cao cấp
  {
    invoice_code: "INV-300125-001",
    store_id: "STORE001",
    total_amount: 540000,
    payment_method: "banking",
    status: "completed",
    products: [
      {
        product_id: "PRD-007",
        name_product: "Gạo ST25 5kg",
        quantity: 3,
        unit_price: 180000,
        total_price: 540000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-30T09:20:00"),
    updated_at: new Date("2025-01-30T09:20:00")
  },

  // HÓA ĐƠN 17: Mua combo mì ăn liền đa dạng
  {
    invoice_code: "INV-300125-002",
    store_id: "STORE001",
    total_amount: 225000,
    payment_method: "cash",
    status: "completed",
    products: [
      {
        product_id: "PRD-001",
        name_product: "Mì Hảo Hảo Tôm Chua Cay",
        quantity: 20,
        unit_price: 4500,
        total_price: 90000
      },
      {
        product_id: "PRD-011",
        name_product: "Mì Omachi Xào Bò",
        quantity: 15,
        unit_price: 6000,
        total_price: 90000
      },
      {
        product_id: "PRD-012",
        name_product: "Mì 3 Miền Tôm Chua Cay",
        quantity: 9,
        unit_price: 5200,
        total_price: 46800
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-30T11:45:00"),
    updated_at: new Date("2025-01-30T11:45:00")
  },

  // HÓA ĐƠN 18: Mua đầy đủ sữa các loại
  {
    invoice_code: "INV-300125-003",
    store_id: "STORE001",
    total_amount: 146000,
    payment_method: "momo",
    status: "completed",
    products: [
      {
        product_id: "PRD-021",
        name_product: "Sữa Tươi Vinamilk 1L",
        quantity: 3,
        unit_price: 32000,
        total_price: 96000
      },
      {
        product_id: "PRD-005",
        name_product: "Sữa Chua Vinamilk Lốc 4",
        quantity: 2,
        unit_price: 14500,
        total_price: 29000
      },
      {
        product_id: "PRD-022",
        name_product: "Sữa Đặc Ông Thọ 380g",
        quantity: 1,
        unit_price: 26000,
        total_price: 26000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-30T14:10:00"),
    updated_at: new Date("2025-01-30T14:10:00")
  },

  // HÓA ĐƠN 19: Mua đồ dùng vệ sinh combo
  {
    invoice_code: "INV-300125-004",
    store_id: "STORE001",
    total_amount: 437000,
    payment_method: "banking",
    status: "completed",
    products: [
      {
        product_id: "PRD-034",
        name_product: "Nước Giặt OMO Matic 3.8kg",
        quantity: 2,
        unit_price: 185000,
        total_price: 370000
      },
      {
        product_id: "PRD-035",
        name_product: "Kem Đánh Răng P/S 230g",
        quantity: 1,
        unit_price: 35000,
        total_price: 35000
      },
      {
        product_id: "PRD-032",
        name_product: "Nước Rửa Chén Sunlight 750g",
        quantity: 1,
        unit_price: 42000,
        total_price: 42000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-30T16:35:00"),
    updated_at: new Date("2025-01-30T16:35:00")
  },

  // HÓA ĐƠN 20: Mua hàng tổng hợp cuối ngày
  {
    invoice_code: "INV-300125-005",
    store_id: "STORE001",
    total_amount: 358000,
    payment_method: "cash",
    status: "completed",
    products: [
      {
        product_id: "PRD-003",
        name_product: "Trứng Gà V.L 10 Quả",
        quantity: 3,
        unit_price: 38000,
        total_price: 114000
      },
      {
        product_id: "PRD-008",
        name_product: "Dầu Ăn Neptune Light 1L",
        quantity: 2,
        unit_price: 52000,
        total_price: 104000
      },
      {
        product_id: "PRD-023",
        name_product: "Gạo Jasmine Nàng Hoa 5kg",
        quantity: 1,
        unit_price: 95000,
        total_price: 95000
      },
      {
        product_id: "PRD-027",
        name_product: "Tương Ớt Cholimex 250ml",
        quantity: 2,
        unit_price: 18000,
        total_price: 36000
      },
      {
        product_id: "PRD-029",
        name_product: "Muối I-ốt 500g",
        quantity: 1,
        unit_price: 8000,
        total_price: 8000
      }
    ],
    date: new Date(),
    created_at: new Date("2025-01-30T18:50:00"),
    updated_at: new Date("2025-01-30T18:50:00")
  }
];


const { ca } = require("date-fns/locale");
const InvoiceModel = require("../schemas/invoice.model");
const postInvoiceController = async (req, res) => {
    try {
        console.log("Received invoice data:", req.body);
        // Xử lý dữ liệu hóa đơn ở đây
        for (const invoice of invoicesData) {
            const newInvoice = new InvoiceModel(invoice);
            await newInvoice.save();
        }
        res.status(200).json({ message: 'Invoice data received successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
const productsData = [
  // DANH MỤC: MÌ GÓI & MÌ ĂN LIỀN
  {
    product_id: "PRD-001",
    store_id: "STORE001",
    category_name: "Mì gói & Mì ăn liền",
    name_product: "Mì Hảo Hảo Tôm Chua Cay",
    brand: "Acecook",
    price: 4500,
    unit: "gói",
    stock_quantity: 500,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-010",
    store_id: "STORE001",
    category_name: "Mì gói & Mì ăn liền",
    name_product: "Mì Kokomi Tôm",
    brand: "Acecook",
    price: 3800,
    unit: "gói",
    stock_quantity: 450,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-011",
    store_id: "STORE001",
    category_name: "Mì gói & Mì ăn liền",
    name_product: "Mì Omachi Xào Bò",
    brand: "Masan",
    price: 6000,
    unit: "gói",
    stock_quantity: 300,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-012",
    store_id: "STORE001",
    category_name: "Mì gói & Mì ăn liền",
    name_product: "Mì 3 Miền Tôm Chua Cay",
    brand: "Asia Foods",
    price: 5200,
    unit: "gói",
    stock_quantity: 400,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: NƯỚC GIẢI KHÁT
  {
    product_id: "PRD-002",
    store_id: "STORE001",
    category_name: "Nước giải khát",
    name_product: "Nước Ngọt Pepsi 1.5L",
    brand: "Pepsi",
    price: 14000,
    unit: "chai",
    stock_quantity: 200,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-013",
    store_id: "STORE001",
    category_name: "Nước giải khát",
    name_product: "Nước Ngọt Coca Cola 1.5L",
    brand: "Coca Cola",
    price: 14000,
    unit: "chai",
    stock_quantity: 220,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-014",
    store_id: "STORE001",
    category_name: "Nước giải khát",
    name_product: "Trà Xanh Không Độ 450ml",
    brand: "Coca Cola",
    price: 9000,
    unit: "chai",
    stock_quantity: 180,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-015",
    store_id: "STORE001",
    category_name: "Nước giải khát",
    name_product: "Sting Dâu 330ml",
    brand: "Pepsi",
    price: 8500,
    unit: "lon",
    stock_quantity: 250,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-016",
    store_id: "STORE001",
    category_name: "Nước giải khát",
    name_product: "Nước Suối Lavie 1.5L",
    brand: "Lavie",
    price: 7000,
    unit: "chai",
    stock_quantity: 300,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: TRỨNG
  {
    product_id: "PRD-003",
    store_id: "STORE001",
    category_name: "Trứng & Thực phẩm tươi sống",
    name_product: "Trứng Gà V.L 10 Quả",
    brand: "Vĩnh Lộc",
    price: 38000,
    unit: "vỉ",
    stock_quantity: 150,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-017",
    store_id: "STORE001",
    category_name: "Trứng & Thực phẩm tươi sống",
    name_product: "Trứng Gà CP 10 Quả",
    brand: "CP",
    price: 35000,
    unit: "vỉ",
    stock_quantity: 130,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: BÁNH KẸO & SNACK
  {
    product_id: "PRD-004",
    store_id: "STORE001",
    category_name: "Bánh kẹo & Snack",
    name_product: "Bánh Gạo One One",
    brand: "Want Want",
    price: 18000,
    unit: "gói",
    stock_quantity: 280,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-006",
    store_id: "STORE001",
    category_name: "Bánh kẹo & Snack",
    name_product: "Snack Oishi Cay",
    brand: "Oishi",
    price: 15000,
    unit: "gói",
    stock_quantity: 320,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-018",
    store_id: "STORE001",
    category_name: "Bánh kẹo & Snack",
    name_product: "Kẹo Alpenliebe Sữa",
    brand: "Alpenliebe",
    price: 28000,
    unit: "gói",
    stock_quantity: 200,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-019",
    store_id: "STORE001",
    category_name: "Bánh kẹo & Snack",
    name_product: "Bánh Oreo Socola",
    brand: "Oreo",
    price: 12000,
    unit: "gói",
    stock_quantity: 250,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-020",
    store_id: "STORE001",
    category_name: "Bánh kẹo & Snack",
    name_product: "Snack Poca Khoai Tây",
    brand: "Oishi",
    price: 8000,
    unit: "gói",
    stock_quantity: 350,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: SỮA & CHẾ PHẨM TỪ SỮA
  {
    product_id: "PRD-005",
    store_id: "STORE001",
    category_name: "Sữa & Chế phẩm từ sữa",
    name_product: "Sữa Chua Vinamilk Lốc 4",
    brand: "Vinamilk",
    price: 14500,
    unit: "lốc",
    stock_quantity: 180,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-021",
    store_id: "STORE001",
    category_name: "Sữa & Chế phẩm từ sữa",
    name_product: "Sữa Tươi Vinamilk 1L",
    brand: "Vinamilk",
    price: 32000,
    unit: "hộp",
    stock_quantity: 120,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-022",
    store_id: "STORE001",
    category_name: "Sữa & Chế phẩm từ sữa",
    name_product: "Sữa Đặc Ông Thọ 380g",
    brand: "Ông Thọ",
    price: 26000,
    unit: "lon",
    stock_quantity: 150,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: GẠO & NGŨ CỐC
  {
    product_id: "PRD-007",
    store_id: "STORE001",
    category_name: "Gạo & Ngũ cốc",
    name_product: "Gạo ST25 5kg",
    brand: "ST25",
    price: 180000,
    unit: "túi",
    stock_quantity: 80,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-023",
    store_id: "STORE001",
    category_name: "Gạo & Ngũ cốc",
    name_product: "Gạo Jasmine Nàng Hoa 5kg",
    brand: "Nàng Hoa",
    price: 95000,
    unit: "túi",
    stock_quantity: 100,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-024",
    store_id: "STORE001",
    category_name: "Gạo & Ngũ cốc",
    name_product: "Gạo Thơm Thiên Long 5kg",
    brand: "Thiên Long",
    price: 110000,
    unit: "túi",
    stock_quantity: 90,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: DẦU ĂN & GIA VỊ
  {
    product_id: "PRD-008",
    store_id: "STORE001",
    category_name: "Dầu ăn & Gia vị",
    name_product: "Dầu Ăn Neptune Light 1L",
    brand: "Neptune",
    price: 52000,
    unit: "chai",
    stock_quantity: 120,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-009",
    store_id: "STORE001",
    category_name: "Dầu ăn & Gia vị",
    name_product: "Đường Tinh Luyện Biên Hòa 1kg",
    brand: "Biên Hòa",
    price: 41000,
    unit: "túi",
    stock_quantity: 150,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-025",
    store_id: "STORE001",
    category_name: "Dầu ăn & Gia vị",
    name_product: "Nước Mắm Nam Ngư 650ml",
    brand: "Nam Ngư",
    price: 38000,
    unit: "chai",
    stock_quantity: 140,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-026",
    store_id: "STORE001",
    category_name: "Dầu ăn & Gia vị",
    name_product: "Mắm Tôm Huế 500g",
    brand: "Hương Xưa",
    price: 32000,
    unit: "hộp",
    stock_quantity: 100,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-027",
    store_id: "STORE001",
    category_name: "Dầu ăn & Gia vị",
    name_product: "Tương Ớt Cholimex 250ml",
    brand: "Cholimex",
    price: 18000,
    unit: "chai",
    stock_quantity: 180,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-028",
    store_id: "STORE001",
    category_name: "Dầu ăn & Gia vị",
    name_product: "Bột Ngọt Ajinomoto 400g",
    brand: "Ajinomoto",
    price: 28000,
    unit: "gói",
    stock_quantity: 160,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-029",
    store_id: "STORE001",
    category_name: "Dầu ăn & Gia vị",
    name_product: "Muối I-ốt 500g",
    brand: "Vissan",
    price: 8000,
    unit: "gói",
    stock_quantity: 200,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: THỰC PHẨM ĐÓNG HỘP
  {
    product_id: "PRD-030",
    store_id: "STORE001",
    category_name: "Thực phẩm đóng hộp",
    name_product: "Cá Hộp Vissan 155g",
    brand: "Vissan",
    price: 22000,
    unit: "hộp",
    stock_quantity: 150,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-031",
    store_id: "STORE001",
    category_name: "Thực phẩm đóng hộp",
    name_product: "Thịt Hộp Spam 340g",
    brand: "Spam",
    price: 85000,
    unit: "hộp",
    stock_quantity: 80,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: VỆ SINH NHÀ CỬA
  {
    product_id: "PRD-032",
    store_id: "STORE001",
    category_name: "Vệ sinh nhà cửa",
    name_product: "Nước Rửa Chén Sunlight 750g",
    brand: "Sunlight",
    price: 42000,
    unit: "chai",
    stock_quantity: 130,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-033",
    store_id: "STORE001",
    category_name: "Vệ sinh nhà cửa",
    name_product: "Nước Lau Sàn Vim 900ml",
    brand: "Vim",
    price: 38000,
    unit: "chai",
    stock_quantity: 110,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-034",
    store_id: "STORE001",
    category_name: "Vệ sinh nhà cửa",
    name_product: "Nước Giặt OMO Matic 3.8kg",
    brand: "OMO",
    price: 185000,
    unit: "túi",
    stock_quantity: 60,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: VỆ SINH CÁ NHÂN
  {
    product_id: "PRD-035",
    store_id: "STORE001",
    category_name: "Vệ sinh cá nhân",
    name_product: "Kem Đánh Răng P/S 230g",
    brand: "P/S",
    price: 35000,
    unit: "tuýp",
    stock_quantity: 140,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-036",
    store_id: "STORE001",
    category_name: "Vệ sinh cá nhân",
    name_product: "Dầu Gội Clear Men 630ml",
    brand: "Clear",
    price: 125000,
    unit: "chai",
    stock_quantity: 90,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-037",
    store_id: "STORE001",
    category_name: "Vệ sinh cá nhân",
    name_product: "Xà Phòng Lifebouy 90g",
    brand: "Lifebuoy",
    price: 12000,
    unit: "cục",
    stock_quantity: 200,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: KHU VỰC THANH TOÁN
  {
    product_id: "PRD-038",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Kẹo Cao Su Lotte Xylitol",
    brand: "Lotte",
    price: 12000,
    unit: "hộp",
    stock_quantity: 300,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-039",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Kẹo Mentos Mint",
    brand: "Mentos",
    price: 8000,
    unit: "gói",
    stock_quantity: 350,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-040",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Kẹo Mút Chupa Chups",
    brand: "Chupa Chups",
    price: 5000,
    unit: "cái",
    stock_quantity: 400,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-041",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Bánh Snack Cosy Que 45g",
    brand: "Bibica",
    price: 6000,
    unit: "gói",
    stock_quantity: 280,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-042",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Kẹo Bạc Hà Halls",
    brand: "Halls",
    price: 10000,
    unit: "gói",
    stock_quantity: 250,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-043",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Socola Kit Kat 41.5g",
    brand: "Nestlé",
    price: 15000,
    unit: "thanh",
    stock_quantity: 220,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-044",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Nước Tăng Lực Number 1 330ml",
    brand: "Tân Hiệp Phát",
    price: 9000,
    unit: "lon",
    stock_quantity: 200,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-045",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Pin AA Panasonic (Vỉ 2 Viên)",
    brand: "Panasonic",
    price: 18000,
    unit: "vỉ",
    stock_quantity: 150,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-046",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Bật Lửa Gas",
    brand: "Generic",
    price: 12000,
    unit: "cái",
    stock_quantity: 180,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-047",
    store_id: "STORE001",
    category_name: "Khu vực thanh toán",
    name_product: "Túi Nilon Siêu Thị (Gói 100 Cái)",
    brand: "Generic",
    price: 25000,
    unit: "gói",
    stock_quantity: 120,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },

  // DANH MỤC: KHU VỰC KHUYẾN MÃI
  {
    product_id: "PRD-048",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Combo Mì Hảo Hảo Tôm Chua Cay (5 Gói)",
    brand: "Acecook",
    price: 20000,
    unit: "combo",
    stock_quantity: 200,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-049",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Combo Nước Ngọt Coca Cola 330ml (6 Lon)",
    brand: "Coca Cola",
    price: 45000,
    unit: "lốc",
    stock_quantity: 150,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-050",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Combo Snack Oishi (3 Gói Mix)",
    brand: "Oishi",
    price: 40000,
    unit: "combo",
    stock_quantity: 180,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-051",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Nước Rửa Chén Sunlight 1.5kg (Tặng 500ml)",
    brand: "Sunlight",
    price: 85000,
    unit: "combo",
    stock_quantity: 100,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-052",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Combo Dầu Gội + Sữa Tắm Clear Men",
    brand: "Clear",
    price: 220000,
    unit: "combo",
    stock_quantity: 80,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-053",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Gạo ST25 10kg (Giá Đặc Biệt)",
    brand: "ST25",
    price: 340000,
    unit: "túi",
    stock_quantity: 60,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-054",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Combo Sữa Chua Vinamilk (12 Hộp)",
    brand: "Vinamilk",
    price: 38000,
    unit: "combo",
    stock_quantity: 120,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-055",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Dầu Ăn Neptune 2L (Tặng 500ml)",
    brand: "Neptune",
    price: 125000,
    unit: "combo",
    stock_quantity: 90,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-056",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Combo Bánh Oreo + Bánh Gạo One One",
    brand: "Mix Brand",
    price: 55000,
    unit: "combo",
    stock_quantity: 110,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  },
  {
    product_id: "PRD-057",
    store_id: "STORE001",
    category_name: "Khu vực khuyến mãi",
    name_product: "Nước Giặt OMO 6kg (Khuyến Mãi 50%)",
    brand: "OMO",
    price: 280000,
    unit: "túi",
    stock_quantity: 50,
    status: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  }
];      
const productModel = require("../schemas/products.model");
const addProductsController = async (req, res) => {
  try {
    for (const productData of productsData) {
      const newProduct = new productModel(productData);
      await newProduct.save();
    }
    res.status(200).json({ message: 'Products added successfully' });
  }catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports = {
    postInvoiceController,
    addProductsController
};