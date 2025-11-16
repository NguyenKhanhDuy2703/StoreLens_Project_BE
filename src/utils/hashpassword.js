const bcrypt = require('bcrypt');
const saltRounds = 10; // Giữ mức 8-10 để cân bằng hiệu suất và bảo mật

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
