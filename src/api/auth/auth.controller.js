/**
 * Auth controller
 */
const authService = require('../../services/auth.service');

/**
 * Register new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const register = async (req, res, next) => {
    try {
        const { profile, ...userData } = req.body;
        const result = await authService.register(userData, profile);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Verify email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyEmail = async (req, res, next) => {
    try {
        await authService.verifyEmail(req.body.token);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * Request password reset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestPasswordReset = async (req, res, next) => {
    try {
        await authService.requestPasswordReset(req.body.email);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        await authService.resetPassword(token, password);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await authService.changePassword(req.user.id, currentPassword, newPassword);
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword
};