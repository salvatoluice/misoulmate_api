const userRepository = require('../repositories/user.repository');
const profileRepository = require('../repositories/profile.repository');
const { generateToken } = require('../config/jwt');
const { hashPassword, verifyPassword, generateRandomToken } = require('../utils/crypto');
const { UnauthorizedError, BadRequestError } = require('../utils/errors');
const userService = require('./user.service');
const { User } = require('../models');

const register = async (userData, profileData = null) => {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    const verificationToken = generateRandomToken();

    const user = await userRepository.create({
        ...userData,
        verificationToken,
        verified: false
    });

    let profile = null;
    if (profileData) {
        profile = await profileRepository.create({
            ...profileData,
            userId: user.id
        });
    }

    const token = generateToken({ id: user.id });

    return {
        user: userService.filterUserData(user),
        profile,
        token
    };
};

const login = async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
    }

    await userRepository.updateLastLogin(user.id);

    const token = generateToken({ id: user.id });

    let profile = null;
    try {
        profile = await profileRepository.findByUserId(user.id);
    } catch (error) {
        // No profile found, that's okay
    }

    return {
        user: userService.filterUserData(user),
        profile,
        token
    };
};

const verifyEmail = async (token) => {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
        throw new BadRequestError('Invalid verification token');
    }

    await user.update({
        verified: true,
        verificationToken: null
    });

    return true;
};

const requestPasswordReset = async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new BadRequestError('User not found');
    }

    const resetToken = generateRandomToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 2); 

    await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
    });

    return {
        email,
        resetToken,
        resetExpires
    };
};

const resetPassword = async (token, password) => {
    const user = await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { [Op.gt]: new Date() } 
        }
    });

    if (!user) {
        throw new BadRequestError('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(password);

    await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
    });

    return true;
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await userRepository.findById(userId);

    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);

    await user.update({ password: hashedPassword });

    return true;
};

module.exports = {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword
};