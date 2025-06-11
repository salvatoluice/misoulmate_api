const messageService = require('./src/services/message.service');
const matchRepository = require('./src/repositories/match.repository');
const logger = require('./src/utils/logger');

function setupMessageHandlers(io, socket) {
    const userId = socket.user.id;

    // Handle new message
    socket.on('message:send', async (data) => {
        try {
            const { matchId, content, media } = data;

            // Save message to database using existing service
            const message = await messageService.sendMessage(matchId, userId, content, media);

            // Emit message to the match room
            io.to(`match:${matchId}`).emit('message:new', message);

            // Get match to find other user
            const match = await matchRepository.findById(matchId);
            const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;

            // Send notification to other user if they're not in the room
            if (!io.sockets.adapter.rooms.get(`match:${matchId}`).has(getUserSocket(otherUserId))) {
                io.to(`user:${otherUserId}`).emit('notification:message', {
                    matchId,
                    message
                });
            }
        } catch (error) {
            logger.error(`Error sending message: ${error.message}`);
            socket.emit('error', { message: error.message });
        }
    });

    // Handle typing indicator
    socket.on('message:typing', (data) => {
        const { matchId, isTyping } = data;

        // Broadcast to others in the room that this user is typing
        socket.to(`match:${matchId}`).emit('message:typing', {
            matchId,
            userId,
            isTyping
        });
    });

    // Handle marking messages as read
    socket.on('message:read', async (data) => {
        try {
            const { matchId } = data;

            // Mark all messages as read in the database
            const count = await messageService.markAllMessagesAsRead(matchId, userId);

            // Notify the other user that messages have been read
            socket.to(`match:${matchId}`).emit('message:read', {
                matchId,
                userId,
                count
            });
        } catch (error) {
            logger.error(`Error marking messages as read: ${error.message}`);
            socket.emit('error', { message: error.message });
        }
    });
}

module.exports = setupMessageHandlers;