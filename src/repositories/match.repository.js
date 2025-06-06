const { Match, User, Profile } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

const create = async (matchData) => {
    return Match.create(matchData);
};

const findById = async (id) => {
    const match = await Match.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user1',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            },
            {
                model: User,
                as: 'user2',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            }
        ]
    });

    if (!match) {
        throw new NotFoundError(`Match with ID ${id} not found`);
    }

    return match;
};

const findByUserIds = async (user1Id, user2Id) => {
    return Match.findOne({
        where: {
            [Op.or]: [
                {
                    user1Id,
                    user2Id
                },
                {
                    user1Id: user2Id,
                    user2Id: user1Id
                }
            ]
        },
        include: [
            {
                model: User,
                as: 'user1',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            },
            {
                model: User,
                as: 'user2',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            }
        ]
    });
};

const findByUserId = async (userId, options = {}) => {
    const { limit = 20, offset = 0, status = 'active' } = options;

    return Match.findAndCountAll({
        where: {
            [Op.or]: [
                { user1Id: userId },
                { user2Id: userId }
            ],
            status
        },
        include: [
            {
                model: User,
                as: 'user1',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            },
            {
                model: User,
                as: 'user2',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            }
        ],
        limit,
        offset,
        order: [
            ['lastMessageAt', 'DESC NULLS LAST'],
            ['createdAt', 'DESC']
        ]
    });
};

const update = async (id, updateData) => {
    const match = await findById(id);
    return match.update(updateData);
};

const updateLastMessageTime = async (id) => {
    const match = await findById(id);
    return match.update({ lastMessageAt: new Date() });
};

const unmatch = async (id, unmatchedBy, reason = null) => {
    const match = await findById(id);
    return match.update({
        status: 'unmatched',
        unmatchedBy,
        unmatchedReason: reason
    });
};

const getMatchCount = async (userId) => {
    return Match.count({
        where: {
            [Op.or]: [
                { user1Id: userId },
                { user2Id: userId }
            ],
            status: 'active'
        }
    });
};

const getRecentMatches = async (userId, limit = 5) => {
    return Match.findAll({
        where: {
            [Op.or]: [
                { user1Id: userId },
                { user2Id: userId }
            ],
            status: 'active'
        },
        include: [
            {
                model: User,
                as: 'user1',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            },
            {
                model: User,
                as: 'user2',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            }
        ],
        limit,
        order: [['createdAt', 'DESC']]
    });
};

module.exports = {
    create,
    findById,
    findByUserIds,
    findByUserId,
    update,
    updateLastMessageTime,
    unmatch,
    getMatchCount,
    getRecentMatches
};