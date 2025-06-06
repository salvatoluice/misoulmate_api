const messageRepository = require('../repositories/message.repository');
const matchRepository = require('../repositories/match.repository');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

const sendMessage = async (matchId, senderId, content, media = null) => {
    const match = await matchRepository.findById(matchId);

    if (match.user1Id !== senderId && match.user2Id !== senderId) {
        throw new ForbiddenError('You can only send messages to your matches');
    }

    if (match.status !== 'active') {
        throw new BadRequestError('Cannot send messages to inactive matches');
    }

    const messageData = {
        matchId,
        senderId,
        content
    };

    if (media && media.url) {
        messageData.mediaUrl = media.url;
        messageData.mediaType = media.type || 'image';
    }

    const message = await messageRepository.create(messageData);

    await matchRepository.updateLastMessageTime(matchId);

    return message;
};

const getMessageById = async (messageId, userId) => {
    const message = await messageRepository.findById(messageId);

    const match = await matchRepository.findById(message.matchId);

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this message');
    }

    return message;
};

const getMessagesByMatchId = async (matchId, userId, options = {}) => {
    const match = await matchRepository.findById(matchId);

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You can only view messages from your matches');
    }

    await messageRepository.markAllAsRead(matchId, userId);

    return messageRepository.findByMatchId(matchId, options);
};

const markMessageAsRead = async (messageId, userId) => {
    const message = await messageRepository.findById(messageId);

    const match = await matchRepository.findById(message.matchId);

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this message');
    }

    if (message.senderId === userId) {
        return message; 
    }

    return messageRepository.markAsRead(messageId);
};

const markAllMessagesAsRead = async (matchId, userId) => {
    const match = await matchRepository.findById(matchId);

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You can only mark messages from your matches as read');
    }

    return messageRepository.markAllAsRead(matchId, userId);
};

const getUnreadCount = async (userId) => {
    return messageRepository.countUnreadByUser(userId);
};

const enrichMatchesWithMessages = async (matches, userId) => {
    const matchIds = matches.map(match => match.id);

    const latestMessages = await messageRepository.getLatestMessagesByMatchIds(matchIds);

    const unreadCounts = await messageRepository.getUnreadCountsByMatchIds(userId, matchIds);

    return matches.map(match => ({
        ...match,
        latestMessage: latestMessages[match.id] || null,
        unreadCount: unreadCounts[match.id] || 0
    }));
};

module.exports = {
    sendMessage,
    getMessageById,
    getMessagesByMatchId,
    markMessageAsRead,
    markAllMessagesAsRead,
    getUnreadCount,
    enrichMatchesWithMessages
};