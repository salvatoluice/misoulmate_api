/**
 * User controller
 */
const userService = require('../../services/user.service');
const profileService = require('../../services/profile.service');

/**
 * Get current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.getUserWithProfile(req.user.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.user.id, req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.user.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

/**
 * Update notification settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateNotifications = async (req, res, next) => {
    try {
        const user = await userService.updateNotificationSettings(req.user.id, req.body.notifications);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCurrentUser,
    getUserById,
    updateUser,
    deleteUser,
    updateNotifications
};