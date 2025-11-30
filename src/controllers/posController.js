const fakeData = [
  {
    "invoice_code": "INV-270125-001",
    "store_id": "STORE001",
    "total_amount": 186000,
    "payment_method": "cash",
    "status": "completed",
    "products": [
      {
        "product_id": "PRD-001",
        "name_product": "Mì Hảo Hảo Tôm Chua Cay",
        "quantity": 5,
        "unit_price": 4500,
        "total_price": 22500
      },
      {
        "product_id": "PRD-002",
        "name_product": "Nước Ngọt Pepsi 1.5L",
        "quantity": 3,
                  "unit_price": 14000,
        "total_price": 42000
      },
      {
        "product_id": "PRD-003",
        "name_product": "Trứng Gà V.L 10 Quả",
        "quantity": 1,
        "unit_price": 38000,
        "total_price": 38000
      }
    ],
    "date": new Date(),
    "created_at": new Date(),
    "updated_at": new Date()
  },

  {
    "invoice_code": "INV-270125-002",
    "store_id": "STORE001",
    "total_amount": 95000,
    "payment_method": "momo",
    "status": "completed",
    "products": [
      {
        "product_id": "PRD-004",
        "name_product": "Bánh Gạo One One",
        "quantity": 2,
        "unit_price": 18000,
        "total_price": 36000
      },
      {
        "product_id": "PRD-005",
        "name_product": "Sữa Chua Vinamilk Lốc 4",
        "quantity": 2,
        "unit_price": 14500,
        "total_price": 29000
      },
      {
        "product_id": "PRD-006",
        "name_product": "Snack Oishi Cay",
        "quantity": 2,
        "unit_price": 15000,
        "total_price": 30000
      }
    ],
    "date": new Date(),
    "created_at": new Date(),
    "updated_at": new Date()
  },

  {
    "invoice_code": "INV-270125-003",
    "store_id": "STORE001",
    "total_amount": 325000,
    "payment_method": "banking",
    "status": "completed",
    "products": [
      {
        "product_id": "PRD-007",
        "name_product": "Gạo ST25 5kg",
        "quantity": 1,
        "unit_price": 180000,
        "total_price": 180000
      },
      {
        "product_id": "PRD-008",
        "name_product": "Dầu Ăn Neptune Light 1L",
        "quantity": 2,
        "unit_price": 52000,
        "total_price": 104000
      },
      {
        "product_id": "PRD-009",
        "name_product": "Đường Tinh Luyện Biên Hòa 1kg",
        "quantity": 1,
        "unit_price": 41000,
        "total_price": 41000
      }
    ],
    "date": new Date(),
    "created_at": new Date(),
    "updated_at": new Date()
  }
]
const InvoiceModel = require("../schemas/invoice.model");
const postInvoiceController = async (req, res) => {
    try {
        console.log("Received invoice data:", req.body);
        // Xử lý dữ liệu hóa đơn ở đây
        for (const invoiceData of fakeData) {
            const newInvoice = new InvoiceModel(invoiceData);
            await newInvoice.save();
        }
        res.status(200).json({ message: 'Invoice data received successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
    postInvoiceController,
};