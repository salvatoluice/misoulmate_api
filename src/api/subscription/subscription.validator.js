const Joi = require('joi');

const createSubscriptionSchema = Joi.object({
    plan: Joi.string().valid('gold', 'platinum', 'diamond').required(),
    billingCycle: Joi.string().valid('monthly', 'yearly').default('monthly'),
    paymentMethod: Joi.string().valid('card', 'paypal', 'apple_pay', 'google_pay').required(),
    paymentToken: Joi.string().required()
});

const subscriptionIdParamSchema = Joi.object({
    id: Joi.string().uuid().required()
});

const cancelSubscriptionSchema = Joi.object({
    reason: Joi.string().max(255)
});

const updateAutoRenewSchema = Joi.object({
    autoRenew: Joi.boolean().required()
});

const changePlanSchema = Joi.object({
    plan: Joi.string().valid('gold', 'platinum', 'diamond').required(),
    billingCycle: Joi.string().valid('monthly', 'yearly')
});

const getQuerySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).default(1)
});

module.exports = {
    createSubscriptionSchema,
    subscriptionIdParamSchema,
    cancelSubscriptionSchema,
    updateAutoRenewSchema,
    changePlanSchema,
    getQuerySchema
};