const User = require('../schemas/user.model');
const Store = require('../schemas/store.model');
const { renderToken ,verifyToken } = require('../utils/handleToken');
const { comparePassword, hashPassword } = require('../utils/hashpassword');

// Đăng nhập
const loginController = async (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ message: 'Account and password are required' });
  }

  try {
    const checkUser = await User.findOne({ account: account });

    if (!checkUser) {
      return res.status(400).json({ message: 'Account does not exist' });
    }

    // So sánh password
    const isMatch = await comparePassword(password, checkUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Cập nhật status thành active
    checkUser.status = 'active';
    await checkUser.save();

    // Tạo token
    const token = renderToken({
      id: checkUser._id,
      account: checkUser.account,
      role: checkUser.role
    });

    // Lưu token vào cookie
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Login success',
      token,
      user: {
        id: checkUser._id,
        account: checkUser.account,
        role: checkUser.role,
        status: checkUser.status
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Đăng ký

const registerController = async (req, res) => { 
  const { fullname, account, email, password, store_id } = req.body;

  // Validate input
  if (!fullname || !account || !email || !password || !store_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Kiểm tra account/email đã tồn tại
    const existingAccount = await User.findOne({ account });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Kiểm tra store tồn tại
    const store = await Store.findOne({ store_id });
    if (!store) {
      return res.status(400).json({ message: 'Selected store does not exist' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Tạo user mới
    const newUser = await User.create({
      fullname,
      account,
      email,
      password: hashedPassword,
      store_id,
      role: 'manager',     // role luôn là manager
      status: 'inactive'   // mặc định không active
    });

    // Tạo token
    const token = renderToken({
      id: newUser._id,
      account: newUser.account,
      role: newUser.role
    });

    // Set cookie token
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Trả về response có store_name
    return res.status(200).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        account: newUser.account,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        store_id: newUser.store_id,
        store_name: store.store_name, // lấy store_name từ schema
        status: newUser.status
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Đăng xuất

const logoutController = async (req, res) => {
  if (!req.cookies.sessionToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Giải mã token để lấy user id
    const decoded = verifyToken(req.cookies.sessionToken);

    if (decoded?.id) {
      // Tìm user theo id và cập nhật status
      await User.findByIdAndUpdate(decoded.id, { status: 'inactive' });
    }

    // Xóa cookie
    res.clearCookie('sessionToken');

    return res.status(200).json({ message: 'Logout success' });

  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = { loginController ,registerController, logoutController  };
