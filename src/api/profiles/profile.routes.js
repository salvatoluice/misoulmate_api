const express = require('express');
const profileController = require('./profile.controller');
const profileValidator = require('./profile.validator');
const { auth, validation } = require('../middlewares');

const router = express.Router();

router.get(
    '/me',
    auth.authenticate,
    profileController.getCurrentProfile
);

router.post(
    '/',
    auth.authenticate,
    validation.validate(profileValidator.createSchema),
    profileController.createProfile
);

router.get(
    '/:id',
    auth.authenticate,
    validation.validate(profileValidator.idParamSchema, 'params'),
    profileController.getProfileById
);

router.patch(
    '/:id',
    auth.authenticate,
    validation.validate(profileValidator.idParamSchema, 'params'),
    validation.validate(profileValidator.updateSchema),
    profileController.updateProfile
);

router.patch(
    '/me/photos',
    auth.authenticate,
    validation.validate(profileValidator.updatePhotosSchema),
    profileController.updatePhotos
);

router.patch(
    '/me/interests',
    auth.authenticate,
    validation.validate(profileValidator.updateInterestsSchema),
    profileController.updateInterests
);

router.put(
    '/me/last-active',
    auth.authenticate,
    profileController.updateLastActive
);

module.exports = router;