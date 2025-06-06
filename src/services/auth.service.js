/**
 * Auth service - Authentication and authorization logic
 */
const userRepository = require('../repositories/user.repository');
const profileRepository = require('../repositories/profile.repository');
const { generateToken } = require('../config/jwt');
const { hashPassword, verifyPassword, generateRandomToken } = require('../utils/crypto');
const { UnauthorizedError, BadRequestError } = require('../utils/errors');
const userService = require('./user.service');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {Object} [profileData] - Optional profile data
 * @returns {Promise<Object>} Registration result with token
 */
const register = async (userData, profileData = null) => {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    // Create verification token
    const verificationToken = generateRandomToken();

    // Create user
    const user = await userRepository.create({
        ...userData,
        verificationToken,
        verified: false
    });

    // Create profile if data provided
    let profile = null;
    if (profileData) {
        profile = await profileRepository.create({
            ...profileData,
            userId: user.id
        });
    }

    // Generate token
    const token = generateToken({ id: user.id });

    // Return user data and token
    return {
        user: userService.filterUserData(user),
        profile,
        token
    };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login result with token
 */
const login = async (email, password) => {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    // Generate token
    const token = generateToken({ id: user.id });

    // Try to get profile
    let profile = null;
    try {
        profile = await profileRepository.findByUserId(user.id);
    } catch (error) {
        // No profile found, that's okay
    }

    // Return user data and token
    return {
        user: userService.filterUserData(user),
        profile,
        token
    };
};

/**
 * Verify user email
 * @param {string} token - Verification token
 * @returns {Promise<boolean>} Success
 */
const verifyEmail = async (token) => {
    // Find user by verification token
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
        throw new BadRequestError('Invalid verification token');
    }

    // Update user
    await user.update({
        verified: true,
        verificationToken: null
    });

    return true;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset token info
 */
const requestPasswordReset = async (email) => {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new BadRequestError('User not found');
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token valid for 1 hour

    // Update user
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

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<boolean>} Success
 */
const resetPassword = async (token, password) => {
    // Find user by reset token
    const user = await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { [Op.gt]: new Date() } // Token not expired
        }
    });

    if (!user) {
        throw new BadRequestError('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user
    await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
    });

    return true;
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    // Find user
    const user = await userRepository.findById(userId);

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user
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