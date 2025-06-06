/**
 * Custom error classes
 */

/**
 * Base error class with HTTP status code
 */
class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 400 Bad Request
 */
class BadRequestError extends CustomError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized
 */
class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden
 */
class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 404 Not Found
 */
class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * 409 Conflict
 */
class ConflictError extends CustomError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

/**
 * 422 Unprocessable Entity
 */
class ValidationError extends CustomError {
    constructor(message = 'Validation failed', errors = null) {
        super(message, 422);
        this.errors = errors;
    }
}

/**
 * 500 Internal Server Error
 */
class InternalServerError extends CustomError {
    constructor(message = 'Internal server error') {
        super(message, 500);
    }
}

module.exports = {
    CustomError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    InternalServerError
};