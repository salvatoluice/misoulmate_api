// repositories/datePlan.repository.js
const { DatePlan, User, Profile, Match } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../utils/errors');

/**
 * Create a new date plan
 */
const create = async (datePlanData) => {
    return DatePlan.create(datePlanData);
};

/**
 * Find a date plan by ID with creator and match details
 */
const findById = async (id) => {
    const datePlan = await DatePlan.findByPk(id, {
        include: [
            {
                model: User,
                as: 'creator',
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['name', 'photos']
                    }
                ],
                attributes: ['id']
            },
            {
                model: User,
                as: 'responder',
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['name', 'photos']
                    }
                ],
                attributes: ['id']
            },
            {
                model: Match,
                as: 'match',
                attributes: ['id', 'user1Id', 'user2Id', 'status']
            }
        ]
    });

    if (!datePlan) {
        throw new NotFoundError(`Date plan with ID ${id} not found`);
    }

    return datePlan;
};

/**
 * Find all date plans for a match
 */
const findByMatchId = async (matchId) => {
    return DatePlan.findAll({
        where: { matchId },
        include: [
            {
                model: User,
                as: 'creator',
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
        order: [['dateTime', 'DESC']]
    });
};

/**
 * Find upcoming date plans for a user
 */
const findUpcomingByUserId = async (userId, options = {}) => {
    const { limit = 10, offset = 0 } = options;

    // Find all matches where user is a participant
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

    return DatePlan.findAndCountAll({
        where: {
            matchId: {
                [Op.in]: matchIds
            },
            dateTime: {
                [Op.gt]: new Date()
            },
            status: {
                [Op.in]: ['proposed', 'confirmed']
            }
        },
        include: [
            {
                model: User,
                as: 'creator',
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['name', 'photos']
                    }
                ],
                attributes: ['id']
            },
            {
                model: Match,
                as: 'match',
                include: [
                    {
                        model: User,
                        as: 'user1',
                        include: [
                            {
                                model: Profile,
                                as: 'profile',
                                attributes: ['name', 'photos']
                            }
                        ],
                        attributes: ['id']
                    },
                    {
                        model: User,
                        as: 'user2',
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
                attributes: ['id', 'user1Id', 'user2Id']
            }
        ],
        order: [['dateTime', 'ASC']],
        limit,
        offset
    });
};

/**
 * Update a date plan
 */
const update = async (id, datePlanData) => {
    const datePlan = await findById(id);
    return datePlan.update(datePlanData);
};

/**
 * Delete a date plan
 */
const remove = async (id) => {
    const datePlan = await findById(id);
    await datePlan.destroy();
    return true;
};

/**
 * Respond to a date plan (confirm, decline)
 */
const respond = async (id, userId, status, responseTime = new Date()) => {
    const datePlan = await findById(id);

    return datePlan.update({
        status,
        responseBy: userId,
        responseAt: responseTime
    });
};

/**
 * Complete a date plan
 */
const complete = async (id) => {
    const datePlan = await findById(id);

    return datePlan.update({
        status: 'completed'
    });
};

module.exports = {
    create,
    findById,
    findByMatchId,
    findUpcomingByUserId,
    update,
    remove,
    respond,
    complete
};