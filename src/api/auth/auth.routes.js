/**
 * Auth routes
 */
const express = require('express');
const authController = require('./auth.controller');
const authValidator = require('./auth.validator');
const { validation, auth } = require('../middlewares');

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register new user
 * @access Public
 */
router.post(
    '/register',
    validation.validate(authValidator.registerSchema),
    authController.register
);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
    '/login',
    validation.validate(authValidator.loginSchema),
    authController.login
);

/**
 * @route POST /api/v1/auth/verify-email
 * @desc Verify email
 * @access Public
 */
router.post(
    '/verify-email',
    validation.validate(authValidator.verifyEmailSchema),
    authController.verifyEmail
);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post(
    '/forgot-password',
    validation.validate(authValidator.requestResetSchema),
    authController.requestPasswordReset
);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password
 * @access Public
 */
router.post(
    '/reset-password',
    validation.validate(authValidator.resetPasswordSchema),
    authController.resetPassword
);

/**
 * @route POST /api/v1/auth/change-password
 * @desc Change password
 * @access Private
 */
router.post(
    '/change-password',
    auth.authenticate,
    validation.validate(authValidator.changePasswordSchema),
    authController.changePassword
);

module.exports = router;