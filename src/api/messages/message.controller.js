const messageService = require('../../services/message.service');

const sendMessage = async (req, res, next) => {
    try {
        const { matchId } = req.params;
        const { content, media } = req.body;

        const message = await messageService.sendMessage(matchId, req.user.id, content, media);

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

        res.json(message);
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const { matchId } = req.params;

        const count = await messageService.markAllMessagesAsRead(matchId, req.user.id);

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

module.exports = {
    sendMessage,
    getMessages,
    getMessage,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};