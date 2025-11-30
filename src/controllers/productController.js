const productService = require('../service/productService');

/**
 * @desc    Lấy danh sách sản phẩm (Đa năng)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        console.log("Controller nhận được Query Params:", req.query);
        const { products, pagination } = await productService.getProducts(req.query);
        
        res.status(200).json({
            message: 'Lấy danh sách sản phẩm thành công',
            data: products,
            pagination: pagination
        });
    } catch (error) {
        // Bắt lỗi từ service (ví dụ: 'Cần cung cấp store_id')
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Tạo sản phẩm mới
 * @route   POST /api/products
 * @access  Private (Admin)
 */
const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json({
            message: 'Tạo sản phẩm mới thành công',
            data: newProduct
        });
    } catch (error) {
        // Bắt lỗi (ví dụ: 'Tên sản phẩm đã tồn tại...')
        res.status(400).json({ message: 'Tạo sản phẩm thất bại', error: error.message });
    }
};


/**
 * @desc    Cập nhật sản phẩm
 * @route   PUT /api/products/:id
 * @access  Private 
 */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productService.updateProduct(id, req.body);
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
        }
        
        res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật sản phẩm thất bại', error: error.message });
    }
};

/**
 * @desc    Xóa sản phẩm
 * @route   DELETE /api/products/:id
 * @access  Private 
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productService.deleteProduct(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }
        
        res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa sản phẩm', error: error.message });
    }
};

/**
 * @desc    Xóa hàng loạt sản phẩm
 * @route   POST /api/products/bulk-delete
 * @access  Private 
 */
const bulkDeleteProducts = async (req, res) => {
    try {
        const { ids, store_id } = req.body; 
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Danh sách ID không hợp lệ' });
        }
        if (!store_id) {
            return res.status(400).json({ message: 'Cần cung cấp store_id' });
        }

        const result = await productService.bulkDeleteProducts(ids, store_id);
        
        res.status(200).json({
            message: `Đã xóa thành công ${result.deletedCount} sản phẩm.`
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa hàng loạt', error: error.message });
    }
};

// Xuất ra các hàm để router sử dụng
module.exports = {
    getProducts, 
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts
};