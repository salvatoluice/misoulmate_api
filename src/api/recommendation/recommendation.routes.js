// src/api/recommendation/recommendation.routes.js
const express = require('express');
const recommendationController = require('./recommendation.controller');
const recommendationValidator = require('./recommendation.validator');
const { auth, validation } = require('../middlewares');

const router = express.Router();

// Get recommendations
router.get(
    '/',
    auth.authenticate,
    validation.validate(recommendationValidator.getRecommendationsQuerySchema, 'query'),
    recommendationController.getRecommendations
);

// Boost profile
router.post(
    '/boost',
    auth.authenticate,
    validation.validate(recommendationValidator.boostProfileSchema),
    recommendationController.boostProfile
);

// Record profile view
router.post(
    '/view',
    auth.authenticate,
    validation.validate(recommendationValidator.recordProfileViewSchema),
    recommendationController.recordProfileView
);

// Filter profiles
router.post(
    '/filter',
    auth.authenticate,
    validation.validate(recommendationValidator.filterProfilesSchema),
    recommendationController.filterProfiles
);

// Refresh recommendations
router.post(
    '/refresh',
    auth.authenticate,
    validation.validate(recommendationValidator.refreshRecommendationsSchema),
    recommendationController.refreshRecommendations
);

// Report a profile
router.post(
    '/report',
    auth.authenticate,
    validation.validate(recommendationValidator.reportRecommendationSchema),
    recommendationController.reportRecommendation
);

module.exports = router;