const profileService = require('../../services/profile.service');
const { ForbiddenError } = require('../../utils/errors');

const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const getCurrentProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

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

const getProfileById = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileById(req.params.id);
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);

        if (profile.id !== req.params.id) {
            throw new ForbiddenError('You can only update your own profile');
        }

        const updatedProfile = await profileService.updateProfile(req.params.id, req.body);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

const updatePhotos = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);

        const updatedProfile = await profileService.updateProfilePhotos(profile.id, req.body.photos);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

const updateInterests = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);

        const updatedProfile = await profileService.updateProfileInterests(profile.id, req.body.interests);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

const updateLastActive = async (req, res, next) => {
    try {
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
    updateLastActive,
    uploadMiddleware: upload
};