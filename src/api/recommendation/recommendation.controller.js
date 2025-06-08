// recommendation.controller.js
const recommendationService = require('../../services/recommendation.service');

const getRecommendations = async (req, res, next) => {
    try {
        const {
            limit = 20,
            page = 1,
            minAge,
            maxAge,
            maxDistance,
            interests,
            lookingFor,
            showMe,
            sortBy = 'compatibilityScore',
            sortOrder = 'desc',
            includePassedProfiles = false,
            onlyShowLikesYou = false
        } = req.query;
        const offset = (page - 1) * limit;

        const recommendations = await recommendationService.getRecommendationsForUser(
            req.user.id,
            {
                limit,
                offset,
                minAge,
                maxAge,
                maxDistance,
                interests,
                lookingFor,
                showMe,
                sortBy,
                sortOrder,
                includePassedProfiles,
                onlyShowLikesYou
            }
        );

        res.json({
            recommendations,
            pagination: {
                page,
                limit,
                total: recommendations.length
            }
        });
    } catch (error) {
        next(error);
    }
};

const boostProfile = async (req, res, next) => {
    try {
        const { duration, boostType } = req.body;

        const boost = await recommendationService.boostUserProfile(
            req.user.id,
            duration,
            boostType
        );

        res.status(201).json({
            success: true,
            boost,
            message: `Your profile has been boosted for ${duration} hour${duration > 1 ? 's' : ''}!`
        });
    } catch (error) {
        next(error);
    }
};

const recordProfileView = async (req, res, next) => {
    try {
        const { profileId, duration, source } = req.body;

        await recommendationService.recordProfileView(
            req.user.id,
            profileId,
            duration,
            source
        );

        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(error);
    }
};

const filterProfiles = async (req, res, next) => {
    try {
        const { excludedProfiles, reason, details } = req.body;

        await recommendationService.filterProfiles(
            req.user.id,
            excludedProfiles,
            reason,
            details
        );

        res.status(200).json({
            success: true,
            message: `${excludedProfiles.length} profiles have been filtered out of your recommendations.`
        });
    } catch (error) {
        next(error);
    }
};

const refreshRecommendations = async (req, res, next) => {
    try {
        const { clearFilters } = req.body;

        const recommendations = await recommendationService.refreshRecommendations(
            req.user.id,
            clearFilters
        );

        res.status(200).json({
            success: true,
            recommendations,
            message: 'Your recommendations have been refreshed!'
        });
    } catch (error) {
        next(error);
    }
};

const reportRecommendation = async (req, res, next) => {
    try {
        const { profileId, reason, details } = req.body;

        await recommendationService.reportProfile(
            req.user.id,
            profileId,
            reason,
            details
        );

        res.status(200).json({
            success: true,
            message: 'Thank you for your report. We will review it shortly.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecommendations,
    boostProfile,
    recordProfileView,
    filterProfiles,
    refreshRecommendations,
    reportRecommendation
};