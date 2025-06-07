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

// router.post(
//   '/photos',
//   auth.authenticate,
//   profileController.uploadMiddleware.array('photos', 5),
//   profileController.uploadPhotos
// );

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
    profileController.uploadMiddleware.array('photos', 6),
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

// router.delete(
//     '/photos/:photoUrl',
//     auth.authenticate,
//     profileController.deletePhoto
//   );

module.exports = router;