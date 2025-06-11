const express = require('express');
const http = require('http');
const { environment } = require('./config');
const globalMiddlewares = require('./middleware');
const apiRoutes = require('./api');
const logger = require('./utils/logger');
const { CustomError } = require('./utils/errors');
const pkg = require('../package.json');
const { initializeSocket } = require('../socket');

const app = express();

const server = http.createServer(app);

const io = initializeSocket(server);

app.set('io', io);

globalMiddlewares.forEach(middleware => {
    app.use(middleware);
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(environment.API_PREFIX, apiRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.status(200).json({
        name: 'MiSoulmate API',
        description: 'Find your lifetime soulmate',
        environment: environment.NODE_ENV,
        apiEndpoint: environment.API_PREFIX,
        documentation: '/docs',
        version: `/version`
    });
});

app.get('/docs', (req, res) => {
    res.status(200).json({
        message: 'API Documentation',
        swagger: `${req.protocol}://${req.get('host')}/api-docs`,
        endpoints: {
            authentication: `${environment.API_PREFIX}/auth`,
            users: `${environment.API_PREFIX}/users`,
            profiles: `${environment.API_PREFIX}/profiles`,
            matches: `${environment.API_PREFIX}/matches`,
            messages: `${environment.API_PREFIX}/messages`
        },
    });
});

app.get('/version', (req, res) => {
    res.status(200).json({
        version: pkg.version,
        name: pkg.name,
        description: pkg.description,
        author: pkg.author,
        license: pkg.license,
        nodeVersion: process.version,
        uptime: process.uptime()
    });
});

app.use((req, res, next) => {
    const error = new CustomError('Not Found', 404);
    next(error);
});

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

module.exports = { app, server };