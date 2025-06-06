const userRepository = require('../repositories/user.repository');
const profileRepository = require('../repositories/profile.repository');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { verifyPassword } = require('../utils/crypto');

const createUser = async (userData) => {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    const user = await userRepository.create(userData);

    return filterUserData(user);
};

const getUserById = async (id) => {
    const user = await userRepository.findById(id);
    return filterUserData(user);
};

const updateUser = async (id, updateData) => {
    if (updateData.email) {
        const existingUser = await userRepository.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== id) {
            throw new BadRequestError('Email already in use');
        }
    }

    const user = await userRepository.update(id, updateData);
    return filterUserData(user);
};

const deleteUser = async (id) => {
    return userRepository.remove(id);
};

const filterUserData = (user) => {
    const { password, verificationToken, resetPasswordToken, ...filteredData } = user.toJSON();
    return filteredData;
};

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