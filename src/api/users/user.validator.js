const Joi = require('joi');

const createSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    notifications: Joi.boolean().default(true),
    subscription: Joi.string().valid('Basic', 'Gold', 'Platinum', 'Diamond').default('Basic')
});

const updateSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    notifications: Joi.boolean(),
    subscription: Joi.string().valid('Basic', 'Gold', 'Platinum', 'Diamond')
}).min(1);

const idParamSchema = Joi.object({
    id: Joi.string().uuid().required()
});

const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
});

const updateNotificationsSchema = Joi.object({
    notifications: Joi.boolean().required()
});

module.exports = {
    createSchema,
    updateSchema,
    idParamSchema,
    updatePasswordSchema,
    updateNotificationsSchema
};