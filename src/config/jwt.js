/**
 * JWT configuration
 */
const jwt = require('jsonwebtoken');
const environment = require('./environment');

/**
 * Generate a JWT token
 * @param {Object} payload - Data to be encoded in the token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, environment.JWT_SECRET, {
        expiresIn: environment.JWT_EXPIRES_IN
    });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, environment.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = {
    generateToken,
    verifyToken
};