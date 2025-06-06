/**
 * Profile service - Business logic for profiles
 */
const profileRepository = require('../repositories/profile.repository');
const userRepository = require('../repositories/user.repository');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Create a new profile
 * @param {Object} profileData - Profile creation data with user ID, name, and optional fields
 * @returns {Promise<Object>} Created profile
 */
const createProfile = async (profileData) => {
    // Verify user exists
    await userRepository.findById(profileData.userId);

    // Check if profile already exists for this user
    try {
        await profileRepository.findByUserId(profileData.userId);
        throw new BadRequestError('Profile already exists for this user');
    } catch (error) {
        if (error instanceof NotFoundError) {
            // This is expected - user doesn't have a profile yet
            return profileRepository.create(profileData);
        }
        throw error;
    }
};

/**
 * Get profile by ID
 * @param {string} id - Profile ID
 * @returns {Promise<Object>} Profile
 */
const getProfileById = async (id) => {
    return profileRepository.findById(id);
};

/**
 * Get profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Profile
 */
const getProfileByUserId = async (userId) => {
    return profileRepository.findByUserId(userId);
};

/**
 * Update profile
 * @param {string} id - Profile ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated profile
 */
const updateProfile = async (id, updateData) => {
    return profileRepository.update(id, updateData);
};

/**
 * Delete profile
 * @param {string} id - Profile ID
 * @returns {Promise<boolean>} Success
 */
const deleteProfile = async (id) => {
    return profileRepository.remove(id);
};

/**
 * Update profile photos
 * @param {string} id - Profile ID
 * @param {string[]} photos - Array of photo URLs
 * @returns {Promise<Object>} Updated profile
 */
const updateProfilePhotos = async (id, photos) => {
    return profileRepository.update(id, { photos });
};

/**
 * Update profile interests
 * @param {string} id - Profile ID
 * @param {string[]} interests - Array of interests
 * @returns {Promise<Object>} Updated profile
 */
const updateProfileInterests = async (id, interests) => {
    return profileRepository.update(id, { interests });
};

/**
 * Update last active timestamp
 * @param {string} id - Profile ID
 * @returns {Promise<Object>} Updated profile
 */
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