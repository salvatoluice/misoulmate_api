/**
 * Request logging middleware
 */
const morgan = require('morgan');
const { environment } = require('../../config');
const logger = require('../../utils/logger');

// Custom token for request ID
morgan.token('id', req => req.id);

// Format for development
const developmentFormat = ':id :method :url :status :response-time ms';

// Format for production
const productionFormat = ':id :method :url :status :response-time ms';

// Stream logs to Winston
const stream = {
    write: (message) => logger.http(message.trim())
};

// Skip logging for testing environment
const skip = () => environment.isTesting();

// Create middleware based on environment
const morganMiddleware = environment.isDevelopment()
    ? morgan(developmentFormat, { stream, skip })
    : morgan(productionFormat, { stream, skip });

module.exports = morganMiddleware;