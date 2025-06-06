const userService = require('../../services/user.service');
const profileService = require('../../services/profile.service');

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.getUserWithProfile(req.user.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.user.id, req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.user.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

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