const mongoose = require('mongoose');
const Product = require('../schemas/products.model.js');


/**
 * @desc    Service: Lấy danh sách sản phẩm 
 */
/*
const getProducts = async (queryOptions) => {
    const page = parseInt(queryOptions.page) || 1;
    const limit = parseInt(queryOptions.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    const { 
        store_id,   
        id,        
        status      
    } = queryOptions;

    if (!store_id) {
        throw new Error('Cần cung cấp store_id để lọc sản phẩm');
    }
    filter.store_id = store_id;

    if (id) {
        filter._id = id;
    }
    // LỌC ĐA NĂNG (DÙNG THAM SỐ 'status')
    if (status) {
        if (status === 'all') {
        } 
        else {
            const isIdFormat = mongoose.Types.ObjectId.isValid(status);

            if (isIdFormat) {
                filter.$or = [
                    { _id: status },
                    { category_name: status }
                ];
            } else {
                const categoriesArray = status.split(',');
                filter.category_name = { $in: categoriesArray };
            }
        }
    }
    else {
        filter.status = true;
    }
    

    // Thực hiện query song song
    const [products, total] = await Promise.all([
        Product.find(filter)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Product.countDocuments(filter)
    ]);

    // Tính toán phân trang
    const totalPages = Math.ceil(total / limit);
    const pagination = {
        totalItems: total,
        totalPages,
        currentPage: page,
        limit
    };

    return { products, pagination };
};
*/
const getProducts = async (queryOptions) => {
    const page = parseInt(queryOptions.page) || 1;
    const limit = parseInt(queryOptions.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Lấy tất cả tham số
    const { 
        store_id,   
        id,        
        status,
        categories  
    } = queryOptions;

    // LỌC STORE_ID (BẮT BUỘC)
    if (!store_id) {
        throw new Error('Cần cung cấp store_id để lọc sản phẩm');
    }
    filter.store_id = store_id;

    // LỌC THEO ID (NẾU CÓ)
    if (id) {
        filter._id = id;
    }

    // LỌC THEO CATEGORY (ĐỘC LẬP)
    if (categories) {
        const categoriesArray = categories.split(',');
        filter.category_name = { $in: categoriesArray };
    }

    // XỬ LÝ LOGIC STATUS MỚI
    if (status) {
        switch (status) {
            case 'all':
                // Không làm gì cả => Lấy cả true và false
                break;
            
            case 'active':
                filter.status = true;
                break;
            
            case 'inactive':
                filter.status = false;
                break;
            
            default:
                // NGOẠI LỆ: TÌM THEO TÊN SẢN PHẨM (name_product)
                filter.name_product = { $regex: status, $options: 'i' };
                break;
        }
    } else {
        filter.status = true;
    }
    
    // 5. Thực hiện query song song
    const [products, total] = await Promise.all([
        Product.find(filter)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Product.countDocuments(filter)
    ]);

    // 6. Tính toán phân trang
    const totalPages = Math.ceil(total / limit);
    const pagination = {
        totalItems: total,
        totalPages,
        currentPage: page,
        limit
    };

    return { products, pagination };
};

/**
 * @desc    Service: Tạo sản phẩm mới
 */
const createProduct = async (productData) => {
    const { name_product, store_id } = productData;
    if (!store_id) {
        throw new Error('Cần cung cấp store_id khi tạo sản phẩm');
    }
    const existingProduct = await Product.findOne({ name_product, store_id });
    if (existingProduct) {
        throw new Error('Tên sản phẩm đã tồn tại trong cửa hàng này');
    }
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
};


/**
 * @desc    Service: Cập nhật sản phẩm
 */
const updateProduct = async (id, updateData) => {
    if (updateData.store_id) {
        delete updateData.store_id;
    }
    return await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

/**
 * @desc    Service: Xóa sản phẩm
 */
const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

/**
 * @desc    Service: Xóa hàng loạt
 */
const bulkDeleteProducts = async (ids, store_id) => {
    // (Giữ nguyên code bulkDeleteProducts của bạn)
    if (!ids || ids.length === 0) {
        throw new Error('Cần cung cấp danh sách ID');
    }
    if (!store_id) {
        throw new Error('Cần cung cấp store_id');
    }
    const result = await Product.deleteMany({
        _id: { $in: ids },
        store_id: store_id 
    });
    return result;
};


module.exports = {
    createProduct,
    getProducts, 
    updateProduct,
    deleteProduct,
    bulkDeleteProducts
};