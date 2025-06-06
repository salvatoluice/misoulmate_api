/**
 * User service - Business logic for users
 */
const userRepository = require('../repositories/user.repository');
const profileRepository = require('../repositories/profile.repository');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { verifyPassword } = require('../utils/crypto');

/**
 * Create a new user
 * @param {Object} userData - User creation data
 * @returns {Promise<Object>} Created user (filtered)
 */
const createUser = async (userData) => {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    // Create user
    const user = await userRepository.create(userData);

    // Filter sensitive data
    return filterUserData(user);
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User (filtered)
 */
const getUserById = async (id) => {
    const user = await userRepository.findById(id);
    return filterUserData(user);
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user (filtered)
 */
const updateUser = async (id, updateData) => {
    // If updating email, check if new email is already in use
    if (updateData.email) {
        const existingUser = await userRepository.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== id) {
            throw new BadRequestError('Email already in use');
        }
    }

    const user = await userRepository.update(id, updateData);
    return filterUserData(user);
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<boolean>} Success
 */
const deleteUser = async (id) => {
    return userRepository.remove(id);
};

/**
 * Filter sensitive user data
 * @param {Object} user - User object
 * @returns {Object} Filtered user data
 */
const filterUserData = (user) => {
    const { password, verificationToken, resetPasswordToken, ...filteredData } = user.toJSON();
    return filteredData;
};

/**
 * Get user with profile
 * @param {string} id - User ID
 * @returns {Promise<Object>} User with profile
 */
const getUserWithProfile = async (id) => {
    const user = await userRepository.findById(id);
    const userData = filterUserData(user);

    try {
        const profile = await profileRepository.findByUserId(id);
        return {
            ...userData,
            profile
        };
    } catch (error) {
        if (error instanceof NotFoundError) {
            return {
                ...userData,
                profile: null
            };
        }
        throw error;
    }
};

/**
 * Update user notification settings
 * @param {string} id - User ID
 * @param {boolean} notifications - Notification preference
 * @returns {Promise<Object>} Updated user
 */
const updateNotificationSettings = async (id, notifications) => {
    const user = await userRepository.update(id, { notifications });
    return filterUserData(user);
};

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserWithProfile,
    updateNotificationSettings,
    filterUserData
};