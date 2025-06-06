const Joi = require('joi');

const createMessageSchema = Joi.object({
    content: Joi.string().required().max(5000),
    media: Joi.object({
        url: Joi.string().uri().required(),
        type: Joi.string().valid('image', 'video', 'audio', 'document').default('image')
    }).optional()
});

const getMessagesQuerySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(50),
    page: Joi.number().integer().min(1).default(1),
    beforeId: Joi.string().uuid()
});

const messageIdParamSchema = Joi.object({
    id: Joi.string().uuid().required()
});

const matchIdParamSchema = Joi.object({
    matchId: Joi.string().uuid().required()
});

module.exports = {
    createMessageSchema,
    getMessagesQuerySchema,
    messageIdParamSchema,
    matchIdParamSchema
};