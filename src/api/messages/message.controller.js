const messageService = require('../../services/message.service');
const onlineService = require('../../services/online.service');

const sendMessage = async (req, res, next) => {
    try {
        const { matchId } = req.params;
        const { content, media } = req.body;

        const message = await messageService.sendMessage(matchId, req.user.id, content, media);

        // Get the socket.io instance
        const io = req.app.get('io');

        // This is a backup in case the message was sent via REST API instead of socket
        if (io) {
            io.to(`match:${matchId}`).emit('message:new', message);

            // Find the other user in the match
            const otherUserId = message.match.user1Id === req.user.id
                ? message.match.user2Id
                : message.match.user1Id;

            // Notify them if they're not in the room
            if (!io.sockets.adapter.rooms.get(`match:${matchId}`)?.has(onlineService.getUserSocket(otherUserId))) {
                io.to(`user:${otherUserId}`).emit('notification:message', {
                    matchId,
                    message
                });
            }
        }

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const { matchId } = req.params;
        const { limit = 50, page = 1, beforeId } = req.query;
        const offset = (page - 1) * limit;

        const messages = await messageService.getMessagesByMatchId(matchId, req.user.id, {
            limit,
            offset,
            beforeId
        });

        // Emit read status update via socket if available
        const io = req.app.get('io');
        if (io) {
            io.to(`match:${matchId}`).emit('message:read', {
                matchId,
                userId: req.user.id
            });
        }

        res.json({
            messages: messages.rows,
            pagination: {
                total: messages.count,
                page,
                limit,
                pages: Math.ceil(messages.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await messageService.getMessageById(id, req.user.id);

        res.json(message);
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await messageService.markMessageAsRead(id, req.user.id);

        // Emit read status update via socket if available
        const io = req.app.get('io');
        if (io) {
            io.to(`match:${message.matchId}`).emit('message:read', {
                messageId: id,
                matchId: message.matchId,
                userId: req.user.id
            });
        }

        res.json(message);
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const { matchId } = req.params;

        const count = await messageService.markAllMessagesAsRead(matchId, req.user.id);

        // Emit read status update via socket if available
        const io = req.app.get('io');
        if (io) {
            io.to(`match:${matchId}`).emit('message:read', {
                matchId,
                userId: req.user.id,
                count
            });
        }

        res.json({
            message: `Marked ${count} messages as read`,
            count
        });
    } catch (error) {
        next(error);
    }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const count = await messageService.getUnreadCount(req.user.id);

        res.json({
            unreadCount: count
        });
    } catch (error) {
        next(error);
    }
};

const getConversations = async (req, res, next) => {
    try {
        const conversations = await messageService.getConversationsByUserId(req.user.id, onlineService);

        res.json({
            conversations
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getMessage,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getConversations
};