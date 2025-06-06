/**
 * Sequelize database connection
 */
const { Sequelize } = require('sequelize');
const { database } = require('../config');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
    database.database,
    database.username,
    database.password,
    {
        host: database.host,
        port: database.port,
        dialect: database.dialect,
        logging: database.logging ? (msg) => logger.debug(msg) : false,
        define: database.define,
        pool: database.pool,
        dialectOptions: database.dialectOptions
    }
);

/**
 * Test database connection
 */
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully.');
        return true;
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        return false;
    }
};

module.exports = {
    sequelize,
    testConnection
};