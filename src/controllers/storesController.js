const Store = require('../schemas/store.model');
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({}, { _id: 0, store_id: 1, store_name: 1 }); 
    return res.status(200).json(stores); 
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllStores
};