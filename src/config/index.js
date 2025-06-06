/**
 * Export all configurations
 */
const environment = require('./environment');
const database = require('./database');
const jwt = require('./jwt');

module.exports = {
    environment,
    database,
    jwt
};