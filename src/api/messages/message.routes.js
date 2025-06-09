const express = require('express');
const messageController = require('./message.controller');
const messageValidator = require('./message.validator');
const matchController = require('../matches/match.controller');
const { auth, validation } = require('../middlewares');

const router = express.Router();

router.post(
    '/matches/:matchId',
    auth.authenticate,
    validation.validate(messageValidator.matchIdParamSchema, 'params'),
    validation.validate(messageValidator.createMessageSchema),
    messageController.sendMessage
);

router.get(
    '/matches/:matchId',
    auth.authenticate,
    validation.validate(messageValidator.matchIdParamSchema, 'params'),
    validation.validate(messageValidator.getMessagesQuerySchema, 'query'),
    messageController.getMessages
);

router.get(
    '/conversations',
    auth.authenticate,
    matchController.getConversations
);

router.get(
    '/:id',
    auth.authenticate,
    validation.validate(messageValidator.messageIdParamSchema, 'params'),
    messageController.getMessage
);

router.patch(
    '/:id/read',
    auth.authenticate,
    validation.validate(messageValidator.messageIdParamSchema, 'params'),
    messageController.markAsRead
);

router.patch(
    '/matches/:matchId/read',
    auth.authenticate,
    validation.validate(messageValidator.matchIdParamSchema, 'params'),
    messageController.markAllAsRead
);

router.get(
    '/unread/count',
    auth.authenticate,
    messageController.getUnreadCount
);

module.exports = router;