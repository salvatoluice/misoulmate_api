/**
 * Logger utility using Winston
 */
const winston = require('winston');
const { environment } = require('../config');
const { format, transports } = winston;

// Define log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
);

// Console format
const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
    })
);

// Define logger transports based on environment
const loggerTransports = [];

// Console transport for all environments
loggerTransports.push(
    new transports.Console({
        format: consoleFormat,
        level: environment.isDevelopment() ? 'debug' : 'info'
    })
);

// File transport for production
if (environment.isProduction()) {
    loggerTransports.push(
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: logFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new transports.File({
            filename: 'logs/combined.log',
            format: logFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    );
}

// Create logger instance
const logger = winston.createLogger({
    level: environment.LOG_LEVEL,
    format: logFormat,
    defaultMeta: { service: 'misoulmate-api' },
    transports: loggerTransports,
    silent: environment.isTesting() // Disable logging in test environment
});

module.exports = logger;