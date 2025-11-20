const Store = require('../schemas/store.model');
const getAllStores = async (req, res) => {
  try {
    // Lấy tất cả store từ database
    const stores = await Store.find({}, { _id: 0, store_id: 1, store_name: 1 }); 
    // { _id: 0 } để loại bỏ _id, chỉ trả store_id và store_name

    return res.status(200).json(stores); // trả về mảng store
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllStores
};