const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'secretkeydefault';
// Xư lý tạo và xác minh token JWT
const renderToken = (data) => {
  return jwt.sign(data, secretKey, { expiresIn: '15m' });// Token hết hạn sau 15 phút
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log('Verify token error:', error);
    return null;
  }
};

module.exports = { renderToken, verifyToken };
