// src/config/database.js

// ✅ Load .env reliably
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const environment = require('./environment');

const development = {
    dialect: 'postgres',
    host: environment.DB_HOST,
    port: environment.DB_PORT,
    database: environment.DB_NAME,
    username: environment.DB_USER,
    password: environment.DB_PASSWORD,
    logging: console.log,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const test = {
    ...development,
    database: `${environment.DB_NAME}_test`,
    logging: false
};

const production = {
    ...development,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
};

const config = {
    development,
    test,
    production
};

module.exports = config[environment.NODE_ENV] || config.development;
