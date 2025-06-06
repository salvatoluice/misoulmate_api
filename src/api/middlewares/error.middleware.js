/**
 * Error handling middleware
 */
const { environment } = require('../../config');
const logger = require('../../utils/logger');

/**
 * Handle errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log server errors
    if (statusCode === 500) {
        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.stack}`);
    } else {
        logger.warn(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${message}`);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(err.errors && { errors: err.errors }),
        ...(environment.isDevelopment() && { stack: err.stack })
    });
};

module.exports = {
    errorHandler
};