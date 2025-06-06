const Joi = require('joi');
const { ValidationError } = require('../../utils/errors');

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorDetails = error.details.map(detail => ({
                path: detail.path.join('.'),
                message: detail.message
            }));

            return next(new ValidationError('Validation failed', errorDetails));
        }

        req[property] = value;
        next();
    };
};

module.exports = {
    validate
};