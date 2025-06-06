/**
 * Environment configuration
 */
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),

    // Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_NAME: process.env.DB_NAME || 'misoulmate',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // API
    API_PREFIX: process.env.API_PREFIX || '/api/v1',

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    // Cors
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

    // Is Development
    isDevelopment() {
        return this.NODE_ENV === 'development';
    },

    // Is Production
    isProduction() {
        return this.NODE_ENV === 'production';
    },

    // Is Testing
    isTesting() {
        return this.NODE_ENV === 'test';
    }
};

module.exports = environment;