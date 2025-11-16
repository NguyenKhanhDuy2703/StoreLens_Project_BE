const User = require('../schemas/user.model');
const { renderToken } = require('../utils/handleToken');

const loginController = async (req, res) => {
  const { account, password } = req.query;

  if (!account || !password) {
    return res.status(400).json({ message: 'Account and password are required' });
  }

  try {
    const checkUser = await User.findOne({ account: account });

    if (!checkUser) {
      return res.status(400).json({ message: 'Account does not exist' });
    }

    if (password !== checkUser.password) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Tạo token JWT
    const token = renderToken({
      id: checkUser._id,
      account: checkUser.account,
      role: checkUser.role
    });

    // Lưu token trong cookie
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Login success',
      token,
      user: {
        id: checkUser._id,
        account: checkUser.account,
        role: checkUser.role,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { loginController };
