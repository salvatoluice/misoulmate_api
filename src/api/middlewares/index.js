/**
 * Combine and export all global middlewares
 */
const corsMiddleware = require('./cors.middleware');
const helmetMiddleware = require('./helmet.middleware');
const loggingMiddleware = require('./logging.middleware');
const validation = require('./validation.middleware');

// Export middlewares in the order they should be applied
module.exports = [
    loggingMiddleware,
    corsMiddleware,
    helmetMiddleware,
    validation
];