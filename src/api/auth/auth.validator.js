/**
 * Auth validators
 */
const Joi = require('joi');

/**
 * Register schema
 */
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    profile: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(18),
        bio: Joi.string(),
        location: Joi.string(),
        photos: Joi.array().items(Joi.string()),
        interests: Joi.array().items(Joi.string()),
        languages: Joi.array().items(Joi.string()),
        lookingFor: Joi.string(),
        showMe: Joi.string(),
        ageRange: Joi.array().items(Joi.number().integer()).length(2),
        maxDistance: Joi.number().integer().positive(),
        questions: Joi.array().items(
            Joi.object({
                question: Joi.string().required(),
                answer: Joi.string().required()
            })
        )
    })
});

/**
 * Login schema
 */
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

/**
 * Verify email schema
 */
const verifyEmailSchema = Joi.object({
    token: Joi.string().required()
});

/**
 * Request password reset schema
 */
const requestResetSchema = Joi.object({
    email: Joi.string().email().required()
});

/**
 * Reset password schema
 */
const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required()
});

/**
 * Change password schema
 */
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
});

module.exports = {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    requestResetSchema,
    resetPasswordSchema,
    changePasswordSchema
};