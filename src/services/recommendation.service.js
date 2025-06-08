const userRepository = require('../repositories/user.repository');
const profileRepository = require('../repositories/profile.repository');
const likeRepository = require('../repositories/like.repository');
const { Profile, User, ProfileView, ProfileBoost, ProfileFilter, ProfileReport } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../utils/errors');

const getRecommendationsForUser = async (userId, options = {}) => {
    const {
        limit = 20,
        offset = 0,
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
    } = options;

    const userProfile = await profileRepository.findByUserId(userId);

    if (!userProfile) {
        throw new NotFoundError('User profile not found');
    }

    const profileWhereClause = {};

    if (minAge !== undefined && maxAge !== undefined) {
        profileWhereClause.age = { [Op.between]: [minAge, maxAge] };
    } else if (userProfile.ageRange) {
        profileWhereClause.age = { [Op.between]: userProfile.ageRange };
    }

    if (showMe) {
        profileWhereClause.gender = showMe;
    } else if (userProfile.showMe && userProfile.showMe !== 'Everyone') {
        profileWhereClause.gender = userProfile.showMe;
    }

    if (interests && interests.length > 0) {
        profileWhereClause.interests = { [Op.overlap]: interests };
    }

    if (lookingFor) {
        profileWhereClause.lookingFor = lookingFor;
    }

    const potentialMatches = await User.findAll({
        where: {
            id: { [Op.ne]: userId },
        },
        include: [
            {
                model: Profile,
                as: 'profile',
                where: profileWhereClause
            }
        ],
        limit: limit * 3,
        offset
    });

    const likers = await likeRepository.getLikers(userId);
    const likerIds = new Set(likers.rows.map(like => like.likerId));

    const interactions = await likeRepository.findByLikerId(userId);
    const interactedIds = new Set();

    if (!includePassedProfiles) {
        interactions.rows.forEach(like => {
            if (like.status === 'dislike') {
                interactedIds.add(like.likedId);
            }
        });
    }

    interactions.rows.forEach(like => {
        if (like.status === 'like' || like.status === 'superlike') {
            interactedIds.add(like.likedId);
        }
    });

    const filteredProfiles = await ProfileFilter.findAll({
        where: { userId }
    });

    filteredProfiles.forEach(filter => {
        interactedIds.add(filter.filteredProfileId);
    });

    let recommendations = await Promise.all(
        potentialMatches
            .filter(user => !interactedIds.has(user.id))
            .filter(user => !onlyShowLikesYou || likerIds.has(user.id))
            .map(async (user) => {
                const score = await calculateCompatibilityScore(userId, user.id);

                const distance = calculateDistance(userProfile.location, user.profile.location);

                if (maxDistance && distance > maxDistance) {
                    return null;
                }

                const boost = await ProfileBoost.findOne({
                    where: {
                        userId: user.id,
                        expiresAt: { [Op.gt]: new Date() }
                    }
                });

                return {
                    id: user.id,
                    name: user.profile.name,
                    age: user.profile.age,
                    gender: user.profile.gender,
                    photos: user.profile.photos,
                    bio: user.profile.bio,
                    interests: user.profile.interests,
                    location: user.profile.location,
                    distance,
                    compatibilityScore: score,
                    hasLikedYou: likerIds.has(user.id),
                    isBoosted: !!boost,
                    lastActive: user.lastActive
                };
            })
    );

    recommendations = recommendations.filter(rec => rec !== null);

    if (sortBy === 'compatibilityScore') {
        recommendations.sort((a, b) => {
            if (a.isBoosted && !b.isBoosted) return -1;
            if (!a.isBoosted && b.isBoosted) return 1;

            if (a.hasLikedYou && !b.hasLikedYou) return -1;
            if (!a.hasLikedYou && b.hasLikedYou) return 1;

            return sortOrder === 'desc'
                ? b.compatibilityScore - a.compatibilityScore
                : a.compatibilityScore - b.compatibilityScore;
        });
    } else if (sortBy === 'distance') {
        recommendations.sort((a, b) => {
            return sortOrder === 'asc'
                ? a.distance - b.distance
                : b.distance - a.distance;
        });
    } else if (sortBy === 'age') {
        recommendations.sort((a, b) => {
            return sortOrder === 'asc'
                ? a.age - b.age
                : b.age - a.age;
        });
    } else if (sortBy === 'recentlyActive') {
        recommendations.sort((a, b) => {
            const dateA = new Date(a.lastActive);
            const dateB = new Date(b.lastActive);
            return sortOrder === 'desc'
                ? dateB - dateA
                : dateA - dateB;
        });
    }

    return recommendations.slice(0, limit);
};

const boostUserProfile = async (userId, duration, boostType = 'standard') => {
    // Check if user exists
    const user = await userRepository.findById(userId);

    // Check if user already has an active boost
    const existingBoost = await ProfileBoost.findOne({
        where: {
            userId,
            expiresAt: { [Op.gt]: new Date() }
        }
    });

    if (existingBoost) {
        throw new BadRequestError('You already have an active profile boost');
    }

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + duration);

    // Create boost record
    const boost = await ProfileBoost.create({
        userId,
        boostType,
        duration,
        expiresAt
    });

    return {
        boostId: boost.id,
        boostType,
        duration,
        expiresAt
    };
};

const recordProfileView = async (viewerId, viewedId, duration = null, source = 'recommendations') => {
    await userRepository.findById(viewerId);
    await userRepository.findById(viewedId);

    await ProfileView.create({
        viewerId,
        viewedId,
        duration,
        source
    });

    return true;
};

const filterProfiles = async (userId, excludedProfileIds, reason, details = null) => {
    await userRepository.findById(userId);

    const filterPromises = excludedProfileIds.map(async (profileId) => {
        await userRepository.findById(profileId);

        return ProfileFilter.create({
            userId,
            filteredProfileId: profileId,
            reason,
            details
        });
    });

    await Promise.all(filterPromises);

    return true;
};

const refreshRecommendations = async (userId, clearFilters = false) => {
    await userRepository.findById(userId);

    if (clearFilters) {
        await ProfileFilter.destroy({
            where: { userId }
        });
    }

    return getRecommendationsForUser(userId, { limit: 20 });
};

const reportProfile = async (reporterId, reportedId, reason, details = null) => {
    await userRepository.findById(reporterId);
    await userRepository.findById(reportedId);

    const existingReport = await ProfileReport.findOne({
        where: {
            reporterId,
            reportedId
        }
    });

    if (existingReport) {
        throw new BadRequestError('You have already reported this profile');
    }

    await ProfileReport.create({
        reporterId,
        reportedId,
        reason,
        details,
        status: 'pending'
    });

    if (['fake', 'inappropriate', 'underageSuspicion'].includes(reason)) {
        await filterProfiles(reporterId, [reportedId], reason, details);
    }

    return true;
};

const calculateDistance = (location1, location2) => {
    // This is a placeholder - in a real app you would implement
    // a proper geospatial distance calculation

    // If locations are stored as strings (e.g., "San Francisco, CA")
    // You might need to geocode them first

    // If locations are stored as coordinates (latitude, longitude)
    // You could use the Haversine formula

    // For demo purposes:
    return Math.floor(Math.random() * 50) + 1;
};

module.exports = {
    getRecommendationsForUser,
    boostUserProfile,
    recordProfileView,
    filterProfiles,
    refreshRecommendations,
    reportProfile
};