const { Payment, User, Subscription } = require('../models');
const { NotFoundError } = require('../utils/errors');

const create = async (paymentData) => {
    return Payment.create(paymentData);
};

const findById = async (id) => {
    const payment = await Payment.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Subscription,
                as: 'subscription'
            }
        ]
    });

    if (!payment) {
        throw new NotFoundError(`Payment with ID ${id} not found`);
    }

    return payment;
};

const findByUserId = async (userId, options = {}) => {
    const { limit = 10, offset = 0 } = options;

    return Payment.findAndCountAll({
        where: {
            userId
        },
        include: [
            {
                model: Subscription,
                as: 'subscription'
            }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

const findBySubscriptionId = async (subscriptionId) => {
    return Payment.findAll({
        where: {
            subscriptionId
        },
        order: [['createdAt', 'DESC']]
    });
};

const updatePaymentStatus = async (id, status, transactionData = null) => {
    const payment = await findById(id);

    const updateData = { status };
    if (transactionData) {
        updateData.transactionData = transactionData;
    }

    return payment.update(updateData);
};

const getRecentPayments = async (options = {}) => {
    const { limit = 50, offset = 0, status = 'completed' } = options;

    return Payment.findAndCountAll({
        where: {
            status
        },
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Subscription,
                as: 'subscription'
            }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

module.exports = {
    create,
    findById,
    findByUserId,
    findBySubscriptionId,
    updatePaymentStatus,
    getRecentPayments
};