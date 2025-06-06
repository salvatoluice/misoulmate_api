/**
 * Validation utilities
 */
const Joi = require('joi');
const { ValidationError } = require('./errors');

/**
 * Validate data against a schema
 * @param {Object} schema - Joi schema
 * @param {Object} data - Data to validate
 * @returns {Object} Validated data
 * @throws {ValidationError} If validation fails
 */
const validate = (schema, data) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errorDetails = error.details.map(detail => ({
            path: detail.path.join('.'),
            message: detail.message
        }));

        throw new ValidationError('Validation failed', errorDetails);
    }

    return value;
};

/**
 * Common validation schemas
 */
const schemas = {
    id: Joi.string().uuid().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    date: Joi.date().iso(),
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).default(1)
};

module.exports = {
    validate,
    schemas
};