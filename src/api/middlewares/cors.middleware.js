/**
 * CORS middleware
 */
const cors = require('cors');
const { environment } = require('../../config');

const corsOptions = {
    origin: environment.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

module.exports = cors(corsOptions);