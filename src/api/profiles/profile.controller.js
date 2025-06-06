/**
 * Profile controller
 */
const profileService = require('../../services/profile.service');
const { ForbiddenError } = require('../../utils/errors');

/**
 * Get current user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getCurrentProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

/**
 * Create profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createProfile = async (req, res, next) => {
    try {
        const profileData = {
            ...req.body,
            userId: req.user.id
        };

        const profile = await profileService.createProfile(profileData);
        res.status(201).json(profile);
    } catch (error) {
        next(error);
    }
};

/**
 * Get profile by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getProfileById = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileById(req.params.id);
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

/**
 * Update profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateProfile = async (req, res, next) => {
    try {
        // Get user's profile
        const profile = await profileService.getProfileByUserId(req.user.id);

        // Check if user owns the profile
        if (profile.id !== req.params.id) {
            throw new ForbiddenError('You can only update your own profile');
        }

        const updatedProfile = await profileService.updateProfile(req.params.id, req.body);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

/**
 * Update profile photos
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updatePhotos = async (req, res, next) => {
    try {
        // Get user's profile
        const profile = await profileService.getProfileByUserId(req.user.id);

        const updatedProfile = await profileService.updateProfilePhotos(profile.id, req.body.photos);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

/**
 * Update profile interests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateInterests = async (req, res, next) => {
    try {
        // Get user's profile
        const profile = await profileService.getProfileByUserId(req.user.id);

        const updatedProfile = await profileService.updateProfileInterests(profile.id, req.body.interests);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

/**
 * Update last active
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateLastActive = async (req, res, next) => {
    try {
        // Get user's profile
        const profile = await profileService.getProfileByUserId(req.user.id);

        const updatedProfile = await profileService.updateLastActive(profile.id);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCurrentProfile,
    createProfile,
    getProfileById,
    updateProfile,
    updatePhotos,
    updateInterests,
    updateLastActive
};