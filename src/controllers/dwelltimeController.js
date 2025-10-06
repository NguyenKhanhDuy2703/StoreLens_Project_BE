const dwelltimeService = require("../service/dwelltimeService"); 

const getAverageDwelltimeToday = async (req, res) => {
  try {
    const { store_id } = req.params;
    const result = await dwelltimeService.getAverageDwelltimeToday(store_id);

    res.status(200).json({
      message: "Tính toán dwelltime trung bình thành công",
      data: result
    });
  } catch (error) {
    console.error("Error getAverageDwelltimeToday:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = { getAverageDwelltimeToday };
