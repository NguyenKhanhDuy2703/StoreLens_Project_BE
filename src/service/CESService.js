// Sản phẩm tương tác nhiều nhất 
const getTopProducts = async (personTrackingModel, cameraModel) => {
  const result = await personTrackingModel.aggregate([
    // Gom theo camera
    {
      $group: {
        _id: "$camera_id",
        touches: { $sum: 1 },
        avgConfidence: { $avg: "$confidence" },
        totalPersons: { $addToSet: "$person_id" }
      }
    },

    // Tính CES và purchaseRate dựa vào dữ liệu thật
    {
      $addFields: {
        ces: { $round: [{ $multiply: ["$avgConfidence", 100] }, 1] }, // CES = trung bình độ tin cậy * 100
        totalPersonCount: { $size: "$totalPersons" }
      }
    },

    // Nối với thông tin camera
    {
      $lookup: {
        from: cameraModel.collection.name,
        localField: "_id",
        foreignField: "camera_code", // khớp với camera_code trong bảng camera
        as: "camera_info"
      }
    },
    { $unwind: "$camera_info" },
    //touches :số lượt người xuất hiện

    // Xử lý purchaseRate: touches / số người * 10%
    {
      $addFields: {
        purchaseRate: {
          $concat: [
            {
              $toString: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$touches", "$totalPersonCount"] },
                      10 // quy đổi ra %
                    ]
                  },
                  1
                ]
              }
            },
            "%"
          ]
        }
      }
    },

    // Chọn dữ liệu cần hiển thị
    {
      $project: {
        _id: 0,
        name: "$camera_info.camera_name",
        location: {
          $concat: [
            "Khu vực ",
            "$camera_info.camera_code",
            " - Cửa hàng ",
            "$camera_info.store_id"
          ]
        },
        touches: 1,
        ces: 1,
        purchaseRate: 1
      }
    },

    // Sắp xếp giảm dần theo lượt tương tác
    { $sort: { touches: -1 } },
    { $limit: 5 }
  ]);

  // Gán thêm rank và màu gradient
  const gradients = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-purple-500 to-pink-600",
    "from-indigo-500 to-blue-600"
  ];

  const formatted = result.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    location: item.location,
    touches: item.touches,
    ces: item.ces,
    purchaseRate: item.purchaseRate,
    gradient: gradients[index] || "from-gray-500 to-gray-700"
  }));

  return formatted;
};

// Điểm CES Tổng thể 
const getCesScores = async (personTrackingModel) => {
  try {
    const data = await personTrackingModel.aggregate([
      {
        $project: {
          pathLength: { $size: "$path_data" } // tính độ dài path_data
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$pathLength" } // tính trung bình
        }
      }
    ]);

    const avg = data.length > 0 ? data[0].avgDuration : 0;

    // CES = (trung bình độ dài path_data / giá trị chuẩn) * 100
    // Giới hạn tối đa 100
    const cesScore = Math.min(100, (avg / 500) * 100).toFixed(1);

    return parseFloat(cesScore);
  } catch (error) {
    console.error("Error calculating CES score:", error);
    return 0;
  }
};

// Loại tương tác 
const getInteractionTypes = async (personTrackingModel) => {
  const result = await personTrackingModel.aggregate([
    { $unwind: "$path_data" },
    {
      $project: {
        duration: "$path_data.duration"
      }
    },
    {
      $bucket: {
        groupBy: "$duration",
        boundaries: [0, 5, 15, 10000],
        default: "Khác",
        output: { count: { $sum: 1 } }
      }
    }
  ]);

  const total = result.reduce((acc, cur) => acc + cur.count, 0);
  return result.map((item) => ({
    type:
    //tạo thêm cái field id hành vi hoặc cái bảng loại hành vi khách hàng 
    //Ví dụ như 0 = Chạm nhẹ, 5 = Càm lên, 15 = Đặt lại .....
      item._id === 0
        ? "Chạm nhẹ"
        : item._id === 5
        ? "Cầm lên"
        : item._id === 15
        ? "Đặt lại"
        : "Khác",
    count: item.count,
    percent: ((item.count / total) * 100).toFixed(1)
  }));
};

// Xu hướng tương tác theo giờ
const getHourlyTrends = async (personTrackingModel) => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const result = await personTrackingModel.aggregate([
    { $match: { created_at: { $gte: startOfDay, $lte: endOfDay } } },
    {
      $group: {
        _id: { $hour: "$created_at" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  return Array.from({ length: 24 }, (_, hour) => {
    const found = result.find((r) => r._id === hour);
    return { hour, count: found ? found.count : 0 };
  });
};

// Hiệu suất theo khu vực

const getAreaPerformances = async (personTrackingModel, cameraModel) => {
  const result = await personTrackingModel.aggregate([
    // Chỉ lấy các document có confidence
    { $match: { confidence: { $exists: true } } },

    //Gom dữ liệu theo camera
    {
      $group: {
        _id: "$camera_id",
        touches: { $sum: 1 },
        totalPersons: { $addToSet: "$person_id" },
        avgConfidence: { $avg: { $ifNull: ["$confidence", 0] } } // nếu null => 0
      }
    },

    //Tính CES score dựa trên confidence
    {
      $addFields: {
        ces: { $round: [{ $multiply: ["$avgConfidence", 100] }, 1] },
        totalPersonCount: { $size: "$totalPersons" }
      }
    },

    // Nối thông tin camera
    {
      $lookup: {
        from: cameraModel.collection.name,
        localField: "_id",
        foreignField: "camera_code",
        as: "camera_info"
      }
    },
    { $unwind: { path: "$camera_info", preserveNullAndEmptyArrays: true } },

    // Tạo location, description, color
    {
      $addFields: {
        location: {
          $concat: ["Khu vực ", "$camera_info.camera_code", " - Cửa hàng ", "$camera_info.store_id"]
        },
        description: "$camera_info.description",
        color: "$camera_info.color"
      }
    },

    // Chọn field cần hiển thị
    {
      $project: {
        _id: 0,
        name: "$camera_info.camera_name",
        location: 1,
        touches: 1,
        ces: 1,
        description: 1,
        color: 1
      }
    },

    // Sắp xếp theo CES giảm dần
    { $sort: { ces: -1 } }
  ]);

  const gradients = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-purple-500 to-pink-600",
    "from-indigo-500 to-blue-600"
  ];

  return result.map((item, index) => ({
    rank: index + 1,
    ...item,
    gradient: gradients[index] || "from-gray-500 to-gray-700"
  }));
};


module.exports = {
  getTopProducts,
  getCesScores,
  getInteractionTypes,
  getHourlyTrends,
  getAreaPerformances
};
