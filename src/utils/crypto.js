const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};


const generateRandomToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
};

module.exports = {
    hashPassword,
    verifyPassword,
    generateRandomToken
};