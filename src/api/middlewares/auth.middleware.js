/**
 * Auth middleware
 */
const { verifyToken } = require('../../config/jwt');
const userRepository = require('../../repositories/user.repository');
const { UnauthorizedError, ForbiddenError } = require('../../utils/errors');

/**
 * Authenticate request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Authentication required');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);

        // Get user
        const user = await userRepository.findById(decoded.id);

        // Add user to request object
        req.user = user;

        next();
    } catch (error) {
        next(new UnauthorizedError('Authentication failed'));
    }
};

/**
 * Require verified email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireVerified = (req, res, next) => {
    if (!req.user.verified) {
        return next(new ForbiddenError('Email verification required'));
    }
    next();
};

/**
 * Require specific subscription
 * @param {string[]} subscriptions - Required subscriptions
 * @returns {Function} Middleware
 */
const requireSubscription = (subscriptions) => {
    return (req, res, next) => {
        if (!subscriptions.includes(req.user.subscription)) {
            return next(new ForbiddenError(`Requires ${subscriptions.join(' or ')} subscription`));
        }
        next();
    };
};

module.exports = {
    authenticate,
    requireVerified,
    requireSubscription
};