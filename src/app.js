/**
 * Express application setup
 */
const express = require('express');
const { environment } = require('./config');
const middlewares = require('./middleware');
const apiRoutes = require('./api');
const logger = require('./utils/logger');
const { CustomError } = require('./utils/errors');

// Initialize express app
const app = express();

// Apply global middlewares
middlewares.forEach(middleware => {
    app.use(middleware);
});

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(environment.API_PREFIX, apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
    const error = new CustomError('Not Found', 404);
    next(error);
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (statusCode === 500) {
        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.stack}`);
    } else {
        logger.warn(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${message}`);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(environment.isDevelopment() && { stack: err.stack })
    });
});

module.exports = app;