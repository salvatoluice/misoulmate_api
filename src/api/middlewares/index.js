/**
 * Export all API middlewares
 */
const authMiddleware = require('./auth.middleware');
const validationMiddleware = require('./validation.middleware');
const errorMiddleware = require('./error.middleware');

module.exports = {
    auth: authMiddleware,
    validation: validationMiddleware,
    error: errorMiddleware
};