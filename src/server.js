const { app, server } = require('./app');
const { environment } = require('./config');
const { testConnection } = require('./db/connection');
const logger = require('./utils/logger');

const startServer = async () => {
    try {
        await testConnection();

        server.listen(environment.PORT, () => {
            logger.info(`Server running in ${environment.NODE_ENV} mode on port ${environment.PORT}`);
            logger.info(`API available at http://localhost:${environment.PORT}${environment.API_PREFIX}`);
            logger.info(`Socket.IO server initialized and running`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...');
    logger.error(err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...');
    logger.error(err);
    process.exit(1);
});

// Start the server
startServer();