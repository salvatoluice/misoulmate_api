const { Message, User, Profile, Match } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

const create = async (messageData) => {
    return Message.create(messageData);
};

const findById = async (id) => {
    const message = await Message.findByPk(id, {
        include: [
            {
                model: User,
                as: 'sender',
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['name', 'photos']
                    }
                ],
                attributes: ['id']
            }
        ]
    });

    if (!message) {
        throw new NotFoundError(`Message with ID ${id} not found`);
    }

    return message;
};

const findByMatchId = async (matchId, options = {}) => {
    const { limit = 50, offset = 0, beforeId = null } = options;

    const whereClause = {
        matchId
    };

    if (beforeId) {
        const message = await Message.findByPk(beforeId);
        if (message) {
            whereClause.createdAt = {
                [Op.lt]: message.createdAt
            };
        }
    }

    return Message.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'sender',
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['name', 'photos']
                    }
                ],
                attributes: ['id']
            }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

const markAsRead = async (id) => {
    const message = await findById(id);
    return message.update({
        isRead: true,
        readAt: new Date()
    });
};

const markAllAsRead = async (matchId, userId) => {
    const [updatedCount] = await Message.update({
        isRead: true,
        readAt: new Date()
    }, {
        where: {
            matchId,
            senderId: {
                [Op.ne]: userId 
            },
            isRead: false
        }
    });

    return updatedCount;
};

const countUnreadByUser = async (userId) => {
    const matches = await Match.findAll({
        where: {
            [Op.or]: [
                { user1Id: userId },
                { user2Id: userId }
            ],
            status: 'active'
        },
        attributes: ['id']
    });

    const matchIds = matches.map(match => match.id);

    return Message.count({
        where: {
            matchId: {
                [Op.in]: matchIds
            },
            senderId: {
                [Op.ne]: userId 
            },
            isRead: false
        }
    });
};

const getLatestMessagesByMatchIds = async (matchIds) => {
    const result = {};

    for (const matchId of matchIds) {
        const messages = await Message.findAll({
            where: { matchId },
            limit: 1,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'sender',
                    include: [
                        {
                            model: Profile,
                            as: 'profile',
                            attributes: ['name']
                        }
                    ],
                    attributes: ['id']
                }
            ]
        });

        if (messages.length > 0) {
            result[matchId] = messages[0];
        } else {
            result[matchId] = null;
        }
    }

    return result;
};

const getUnreadCountsByMatchIds = async (userId, matchIds) => {
    const result = {};

    for (const matchId of matchIds) {
        const count = await Message.count({
            where: {
                matchId,
                senderId: {
                    [Op.ne]: userId
                },
                isRead: false
            }
        });

        result[matchId] = count;
    }

    return result;
};

module.exports = {
    create,
    findById,
    findByMatchId,
    markAsRead,
    markAllAsRead,
    countUnreadByUser,
    getLatestMessagesByMatchIds,
    getUnreadCountsByMatchIds
};