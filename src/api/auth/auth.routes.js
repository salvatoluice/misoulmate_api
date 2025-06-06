const express = require('express');
const authController = require('./auth.controller');
const authValidator = require('./auth.validator');
const { validation, auth } = require('../middlewares');

const router = express.Router();

router.post(
    '/register',
    validation.validate(authValidator.registerSchema),
    authController.register
);


router.post(
    '/login',
    validation.validate(authValidator.loginSchema),
    authController.login
);

router.post(
    '/verify-email',
    validation.validate(authValidator.verifyEmailSchema),
    authController.verifyEmail
);

router.post(
    '/forgot-password',
    validation.validate(authValidator.requestResetSchema),
    authController.requestPasswordReset
);

router.post(
    '/reset-password',
    validation.validate(authValidator.resetPasswordSchema),
    authController.resetPassword
);

router.post(
    '/change-password',
    auth.authenticate,
    validation.validate(authValidator.changePasswordSchema),
    authController.changePassword
);

module.exports = router;