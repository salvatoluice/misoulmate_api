const { isUserOnline, getOnlineUsers } = require('../../socket');
const { User, Profile } = require('../models');
const { Op } = require('sequelize');

const getOnlineStatus = async (userIds) => {
    const onlineUsers = getOnlineUsers();

    const statuses = {};

    userIds.forEach(userId => {
        statuses[userId] = onlineUsers.includes(userId);
    });

    return statuses;
};

const getOnlineUsersWithProfiles = async () => {
    const onlineUserIds = getOnlineUsers();

    if (onlineUserIds.length === 0) {
        return [];
    }

    return User.findAll({
        where: {
            id: {
                [Op.in]: onlineUserIds
            }
        },
        include: [
            {
                model: Profile,
                as: 'profile',
                attributes: ['name', 'photos']
            }
        ],
        attributes: ['id']
    });
};

module.exports = {
    getOnlineStatus,
    getOnlineUsersWithProfiles
};