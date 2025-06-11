const socketIO = require('socket.io');
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for auth
const { environment } = require('./src/config');
const logger = require('./src/utils/logger');
const setupMessageHandlers = require('./socket.message.handler');

// User socket mapping to keep track of online users
const userSockets = new Map(); // userId -> socket.id
const socketUsers = new Map(); // socket.id -> userId

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: environment.CORS_ORIGIN || '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, environment.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            logger.error(`Socket authentication error: ${error.message}`);
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user.id;
        logger.info(`User connected: ${userId}`);

        // Store user connection
        userSockets.set(userId, socket.id);
        socketUsers.set(socket.id, userId);

        // Join personal room for direct messages
        socket.join(`user:${userId}`);

        // Notify others that user is online
        socket.broadcast.emit('user:online', { userId });

        // Set up message handlers
        setupMessageHandlers(io, socket);

        // Handle joining a match chat
        socket.on('match:join', (matchId) => {
            socket.join(`match:${matchId}`);
            logger.info(`User ${userId} joined match room: ${matchId}`);
        });

        // Handle leaving a match chat
        socket.on('match:leave', (matchId) => {
            socket.leave(`match:${matchId}`);
            logger.info(`User ${userId} left match room: ${matchId}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${userId}`);
            userSockets.delete(userId);
            socketUsers.delete(socket.id);
            socket.broadcast.emit('user:offline', { userId });
        });
    });

    return io;
}

// Check if a user is online
function isUserOnline(userId) {
    return userSockets.has(userId);
}

// Get all online users
function getOnlineUsers() {
    return Array.from(userSockets.keys());
}

// Get socket ID for a specific user
function getUserSocket(userId) {
    return userSockets.get(userId);
}

module.exports = {
    initializeSocket,
    isUserOnline,
    getOnlineUsers,
    getUserSocket
};