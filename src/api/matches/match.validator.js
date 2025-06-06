const Joi = require('joi');

const createLikeSchema = Joi.object({
    likedId: Joi.string().uuid().required(),
    status: Joi.string().valid('like', 'dislike', 'superlike').default('like')
});

const getQuerySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(20),
    page: Joi.number().integer().min(1).default(1),
    status: Joi.string().valid('active', 'paused', 'unmatched', 'like', 'dislike', 'superlike')
});

const matchIdParamSchema = Joi.object({
    id: Joi.string().uuid().required()
});

const unmatchSchema = Joi.object({
    reason: Joi.string().max(255)
});

module.exports = {
    createLikeSchema,
    getQuerySchema,
    matchIdParamSchema,
    unmatchSchema
};