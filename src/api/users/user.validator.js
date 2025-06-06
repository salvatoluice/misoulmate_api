/**
 * User validators
 */
const Joi = require('joi');

/**
 * Create user schema
 */
const createSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    notifications: Joi.boolean().default(true),
    subscription: Joi.string().valid('Free', 'Premium', 'Gold').default('Free')
});

/**
 * Update user schema
 */
const updateSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    notifications: Joi.boolean(),
    subscription: Joi.string().valid('Free', 'Premium', 'Gold')
}).min(1);

/**
 * User ID param schema
 */
const idParamSchema = Joi.object({
    id: Joi.string().uuid().required()
});

/**
 * Update password schema
 */
const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
});

/**
 * Update notifications schema
 */
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