const { Subscription, User, Payment } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

const create = async (subscriptionData) => {
    return Subscription.create(subscriptionData);
};

const findById = async (id) => {
    const subscription = await Subscription.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user'
            }
        ]
    });

    if (!subscription) {
        throw new NotFoundError(`Subscription with ID ${id} not found`);
    }

    return subscription;
};

const findByUserId = async (userId) => {
    return Subscription.findOne({
        where: {
            userId,
            status: {
                [Op.in]: ['active', 'paused']
            }
        },
        order: [['createdAt', 'DESC']]
    });
};

const findUserSubscriptionHistory = async (userId, options = {}) => {
    const { limit = 10, offset = 0 } = options;

    return Subscription.findAndCountAll({
        where: {
            userId
        },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

const findActiveSubscriptionsByPlan = async (plan, options = {}) => {
    const { limit = 100, offset = 0 } = options;

    return Subscription.findAndCountAll({
        where: {
            plan,
            status: 'active'
        },
        include: [
            {
                model: User,
                as: 'user'
            }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

const findExpiringSubscriptions = async (daysToExpiration = 3) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpiration);

    return Subscription.findAll({
        where: {
            status: 'active',
            endDate: {
                [Op.lte]: expirationDate,
                [Op.gt]: new Date()
            },
            autoRenew: false
        },
        include: [
            {
                model: User,
                as: 'user'
            }
        ],
        order: [['endDate', 'ASC']]
    });
};

const update = async (id, updateData) => {
    const subscription = await findById(id);
    return subscription.update(updateData);
};

const cancelSubscription = async (id, reason = null) => {
    const subscription = await findById(id);

    return subscription.update({
        status: 'cancelled',
        cancelReason: reason,
        cancelDate: new Date(),
        autoRenew: false
    });
};

const getActiveSubscriptionCount = async (plan = null) => {
    const whereClause = {
        status: 'active'
    };

    if (plan) {
        whereClause.plan = plan;
    }

    return Subscription.count({
        where: whereClause
    });
};

const getUserLatestPayment = async (userId) => {
    return Payment.findOne({
        where: {
            userId,
            status: 'completed'
        },
        order: [['createdAt', 'DESC']]
    });
};

module.exports = {
    create,
    findById,
    findByUserId,
    findUserSubscriptionHistory,
    findActiveSubscriptionsByPlan,
    findExpiringSubscriptions,
    update,
    cancelSubscription,
    getActiveSubscriptionCount,
    getUserLatestPayment
};