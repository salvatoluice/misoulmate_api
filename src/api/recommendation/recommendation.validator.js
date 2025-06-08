// recommendation.validator.js
const Joi = require('joi');

/**
 * Schema for GET /recommendations query parameters
 */
const getRecommendationsQuerySchema = Joi.object({
    // Pagination
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),

    // Filtering options
    minAge: Joi.number().integer().min(18).max(99),
    maxAge: Joi.number().integer().min(18).max(99).greater(Joi.ref('minAge')),
    maxDistance: Joi.number().integer().positive(),
    interests: Joi.array().items(Joi.string()),
    lookingFor: Joi.string().valid('Relationship', 'Casual', 'Friendship', 'Marriage'),
    showMe: Joi.string().valid('Women', 'Men', 'Everyone'),

    // Sorting options
    sortBy: Joi.string().valid('compatibilityScore', 'distance', 'age', 'recentlyActive').default('compatibilityScore'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),

    // Feature flags
    includePassedProfiles: Joi.boolean().default(false),
    onlyShowLikesYou: Joi.boolean().default(false) // Premium feature
});

/**
 * Schema for GET /recommendations/:id params
 */
const recommendationIdParamSchema = Joi.object({
    id: Joi.string().uuid().required()
});

/**
 * Schema for boosting your profile
 */
const boostProfileSchema = Joi.object({
    duration: Joi.number().integer().valid(1, 3, 6, 24).required(), // Duration in hours
    boostType: Joi.string().valid('standard', 'premium').default('standard')
});

/**
 * Schema for recording profile views
 */
const recordProfileViewSchema = Joi.object({
    profileId: Joi.string().uuid().required(),
    duration: Joi.number().integer().min(1).default(null), // How long they viewed in seconds (optional)
    source: Joi.string().valid('recommendations', 'search', 'browse').default('recommendations')
});

/**
 * Schema for filtering out specific profiles
 */
const filterProfilesSchema = Joi.object({
    excludedProfiles: Joi.array().items(Joi.string().uuid()).min(1),
    reason: Joi.string().valid('notInterested', 'inappropriate', 'fake', 'other').required(),
    details: Joi.string().max(500).when('reason', {
        is: 'other',
        then: Joi.required(),
        otherwise: Joi.optional()
    })
});

/**
 * Schema for refreshing recommendations
 */
const refreshRecommendationsSchema = Joi.object({
    clearFilters: Joi.boolean().default(false)
});

/**
 * Schema for reporting recommendations
 */
const reportRecommendationSchema = Joi.object({
    profileId: Joi.string().uuid().required(),
    reason: Joi.string().valid('inappropriate', 'fake', 'offensive', 'underageSuspicion', 'spam', 'other').required(),
    details: Joi.string().max(500).when('reason', {
        is: 'other',
        then: Joi.required(),
        otherwise: Joi.optional()
    })
});

module.exports = {
    getRecommendationsQuerySchema,
    recommendationIdParamSchema,
    boostProfileSchema,
    recordProfileViewSchema,
    filterProfilesSchema,
    refreshRecommendationsSchema,
    reportRecommendationSchema
};