/**
 * User routes
 */
const express = require('express');
const userController = require('./user.controller');
const userValidator = require('./user.validator');
const { auth, validation } = require('../middlewares');

const router = express.Router();

/**
 * @route GET /api/v1/users/me
 * @desc Get current user
 * @access Private
 */
router.get(
    '/me',
    auth.authenticate,
    userController.getCurrentUser
);

/**
 * @route GET /api/v1/users/:id
 * @desc Get user by ID
 * @access Private
 */
router.get(
    '/:id',
    auth.authenticate,
    validation.validate(userValidator.idParamSchema, 'params'),
    userController.getUserById
);

/**
 * @route PATCH /api/v1/users/me
 * @desc Update current user
 * @access Private
 */
router.patch(
    '/me',
    auth.authenticate,
    validation.validate(userValidator.updateSchema),
    userController.updateUser
);

/**
 * @route DELETE /api/v1/users/me
 * @desc Delete current user
 * @access Private
 */
router.delete(
    '/me',
    auth.authenticate,
    userController.deleteUser
);

/**
 * @route PATCH /api/v1/users/me/notifications
 * @desc Update notification settings
 * @access Private
 */
router.patch(
    '/me/notifications',
    auth.authenticate,
    validation.validate(userValidator.updateNotificationsSchema),
    userController.updateNotifications
);

module.exports = router;