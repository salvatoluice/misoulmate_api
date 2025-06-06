const profileRepository = require('../repositories/profile.repository');
const userRepository = require('../repositories/user.repository');
const { NotFoundError, BadRequestError } = require('../utils/errors');

const createProfile = async (profileData) => {
    await userRepository.findById(profileData.userId);

    try {
        await profileRepository.findByUserId(profileData.userId);
        throw new BadRequestError('Profile already exists for this user');
    } catch (error) {
        if (error instanceof NotFoundError) {
            return profileRepository.create(profileData);
        }
        throw error;
    }
};

const getProfileById = async (id) => {
    return profileRepository.findById(id);
};

const getProfileByUserId = async (userId) => {
    return profileRepository.findByUserId(userId);
};

const updateProfile = async (id, updateData) => {
    return profileRepository.update(id, updateData);
};

const deleteProfile = async (id) => {
    return profileRepository.remove(id);
};

const updateProfilePhotos = async (id, photos) => {
    return profileRepository.update(id, { photos });
};

const updateProfileInterests = async (id, interests) => {
    return profileRepository.update(id, { interests });
};

const updateLastActive = async (id) => {
    return profileRepository.updateLastActive(id);
};

module.exports = {
    createProfile,
    getProfileById,
    getProfileByUserId,
    updateProfile,
    deleteProfile,
    updateProfilePhotos,
    updateProfileInterests,
    updateLastActive
};