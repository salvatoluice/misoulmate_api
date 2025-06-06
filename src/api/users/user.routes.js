const express = require('express');
const userController = require('./user.controller');
const userValidator = require('./user.validator');
const { auth, validation } = require('../middlewares');

const router = express.Router();

router.get(
    '/me',
    auth.authenticate,
    userController.getCurrentUser
);

router.get(
    '/:id',
    auth.authenticate,
    validation.validate(userValidator.idParamSchema, 'params'),
    userController.getUserById
);

router.patch(
    '/me',
    auth.authenticate,
    validation.validate(userValidator.updateSchema),
    userController.updateUser
);

router.delete(
    '/me',
    auth.authenticate,
    userController.deleteUser
);

router.patch(
    '/me/notifications',
    auth.authenticate,
    validation.validate(userValidator.updateNotificationsSchema),
    userController.updateNotifications
);

module.exports = router;