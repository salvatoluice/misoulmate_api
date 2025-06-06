const { verifyToken } = require('../../config/jwt');
const userRepository = require('../../repositories/user.repository');
const { UnauthorizedError, ForbiddenError } = require('../../utils/errors');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Authentication required');
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);

        const user = await userRepository.findById(decoded.id);

        req.user = user;

        next();
    } catch (error) {
        next(new UnauthorizedError('Authentication failed'));
    }
};

const requireVerified = (req, res, next) => {
    if (!req.user.verified) {
        return next(new ForbiddenError('Email verification required'));
    }
    next();
};

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