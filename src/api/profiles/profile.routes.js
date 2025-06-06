/**
 * Profile routes
 */
const express = require('express');
const profileController = require('./profile.controller');
const profileValidator = require('./profile.validator');
const { auth, validation } = require('../middlewares');

const router = express.Router();

/**
 * @route GET /api/v1/profiles/me
 * @desc Get current user's profile
 * @access Private
 */
router.get(
    '/me',
    auth.authenticate,
    profileController.getCurrentProfile
);

/**
 * @route POST /api/v1/profiles
 * @desc Create profile
 * @access Private
 */
router.post(
    '/',
    auth.authenticate,
    validation.validate(profileValidator.createSchema),
    profileController.createProfile
);

/**
 * @route GET /api/v1/profiles/:id
 * @desc Get profile by ID
 * @access Private
 */
router.get(
    '/:id',
    auth.authenticate,
    validation.validate(profileValidator.idParamSchema, 'params'),
    profileController.getProfileById
);

/**
 * @route PATCH /api/v1/profiles/:id
 * @desc Update profile
 * @access Private
 */
router.patch(
    '/:id',
    auth.authenticate,
    validation.validate(profileValidator.idParamSchema, 'params'),
    validation.validate(profileValidator.updateSchema),
    profileController.updateProfile
);

/**
 * @route PATCH /api/v1/profiles/me/photos
 * @desc Update profile photos
 * @access Private
 */
router.patch(
    '/me/photos',
    auth.authenticate,
    validation.validate(profileValidator.updatePhotosSchema),
    profileController.updatePhotos
);

/**
 * @route PATCH /api/v1/profiles/me/interests
 * @desc Update profile interests
 * @access Private
 */
router.patch(
    '/me/interests',
    auth.authenticate,
    validation.validate(profileValidator.updateInterestsSchema),
    profileController.updateInterests
);

/**
 * @route PUT /api/v1/profiles/me/last-active
 * @desc Update last active timestamp
 * @access Private
 */
router.put(
    '/me/last-active',
    auth.authenticate,
    profileController.updateLastActive
);

module.exports = router;