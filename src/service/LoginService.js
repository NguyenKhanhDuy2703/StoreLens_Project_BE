const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'secretkeydefault';

const renderToken = (data) => {
  return jwt.sign(data, secretKey, { expiresIn: '15m' });
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
