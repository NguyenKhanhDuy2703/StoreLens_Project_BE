const productModel = require("../schemas/products.model.js");

const getListProducts = async (req, res) => {
  try {
    const { store_id, page = 1, limit = 10 } = req.query;

    if (!store_id) {
      return res.status(400).json({ message: 'Store Id is not found ?' });
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Lấy dữ liệu + đếm tổng song song
    const [products, totalProducts] = await Promise.all([
      productModel
        .find({ store_id })
        .select({
          _id: 0,
          product_id: 1,
          category_name: 1,
          name_product: 1,
          brand: 1,
          price: 1,
          unit: 1,
          stock_quantity: 1,
          status: 1
        })
        .skip(skip)
        .limit(limitNumber),

      productModel.countDocuments({ store_id })
    ]);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      message: 'Get list products successfully',
      data: products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const getListCategories = async (req, res) => {
  try {
    const { store_id } = req.query;
    if (!store_id) {
      return res.status(400).json({ message: "Store Id is not found ?" });
    }
    const categories = await productModel
      .find({ store_id: store_id })
      .distinct("category_name");
    res.status(200).json({
      message: "Lấy danh sách danh mục thành công",
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi máy chủ khi lấy danh sách danh mục",
        error: error.message,
      });
  }
};
module.exports = {
  getListCategories,
  getListProducts,
};
