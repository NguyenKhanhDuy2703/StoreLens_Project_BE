const userModel = require("../schemas/user.model");
const storeModel = require("../schemas/store.model");
const { renderToken, verifyToken } = require("../utils/handleToken");
const { comparePassword, hashPassword } = require("../utils/hashpassword");

const loginController = async (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    return res
      .status(400)
      .json({ message: "Account and password are required" });
  }
  try {
    const checkUser = await userModel.findOne({ account: account.trim() });
    if (!checkUser) {
      return res.status(400).json({ message: "Tài khoản  không tồn tại " });
    }
    const isMatch = await comparePassword(password.trim(), checkUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }
    const checkStatus = await userModel.findOne({ account: account.trim(), status: "active" });
    if (!checkStatus) {
      return res.status(403).json({ message: "Tài khoản chưa được kích hoạt" });
    }
    // Tạo token
    const token = renderToken({
      id: checkUser._id,
      account: checkUser.account,
      role: checkUser.role,
    });
    // Lưu token vào cookie
    res.cookie("sessionToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login success",
      token,
      user: {
        id: checkUser._id,
        account: checkUser.account,
        role: checkUser.role,
        status: checkUser.status,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const registerController = async (req, res) => {
  const { fullname, account, email, password, store_id } = req.body;
  if (!fullname || !account || !email || !password || !store_id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingAccount = await userModel.exists({ account });
    if (existingAccount) {
      return res.status(400).json({ message: "Account already exists" });
    }
    const existingEmail = await userModel.exists({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const store = await storeModel.exists({ store_id });
    if (!store) {
      return res.status(400).json({ message: "Selected store does not exist" });
    }
    const hashedPassword = await hashPassword(password);
     const newUser = await new userModel({
      fullname,
      account,
      email,
      password: hashedPassword,
      store_id,
      role: "manager", 
      status: "inactive", 
    }).save();
    return res.status(200).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        account: newUser.account,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        store_id: newUser.store_id,
        store_name: store.store_name, 
        status: newUser.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
// Đăng xuất
const logoutController = async (req, res) => {
  if (!req.cookies.sessionToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    console.log("Logging out user with token:", req.cookies.sessionToken);
    res.clearCookie("sessionToken");
    return res.status(200).json({ message: "Logout success" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginController, registerController, logoutController };
