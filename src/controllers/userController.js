const userModel = require("../schemas/user.model");
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    return res.status(200).json({ message: "Danh sách user", users });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const banUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      { status: "inactive", updated_at: new Date() },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    return res.status(200).json({ message: "Đã khóa tài khoản", user });
  } catch (error) {
    console.error("BanUser Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const activateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      { status: "active", updated_at: new Date() },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    return res.status(200).json({ message: "Tài khoản đã được kích hoạt", user });
  } catch (error) {
    console.error("ActivateUser Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllUsers,
  banUser,
  activateUser,
};