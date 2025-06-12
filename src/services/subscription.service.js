const subscriptionRepository = require('../repositories/subscription.repository');
const paymentRepository = require('../repositories/payment.repository');
const userRepository = require('../repositories/user.repository');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');
const { calculateEndDate, calculatePlanPrice } = require('../utils/subscription-helpers');

// Maps of plan prices
const PLAN_PRICES = {
    gold: {
        monthly: 25.00,
        yearly: 120.00
    },
    platinum: {
        monthly: 40.00,
        yearly: 160.00
    },
    diamond: {
        monthly: 60.00,
        yearly: 220.00
    }
};

const createSubscription = async (userId, planData, paymentData) => {
    const { plan, billingCycle = 'monthly' } = planData;

    // Validate plan
    if (!['gold', 'platinum', 'diamond'].includes(plan)) {
        throw new BadRequestError('Invalid subscription plan');
    }

    // Check if user already has an active subscription
    const existingSubscription = await subscriptionRepository.findByUserId(userId);
    if (existingSubscription && existingSubscription.status === 'active') {
        throw new BadRequestError('User already has an active subscription');
    }

    // Calculate price and dates
    const price = PLAN_PRICES[plan][billingCycle];
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, billingCycle);

    // Create subscription
    const subscription = await subscriptionRepository.create({
        userId,
        plan,
        status: 'active',
        startDate,
        endDate,
        billingCycle,
        price,
        autoRenew: true,
        paymentMethod: paymentData.paymentMethod,
        paymentId: paymentData.paymentId,
        lastBillingDate: startDate,
        nextBillingDate: endDate
    });

    // Create payment record
    const payment = await paymentRepository.create({
        userId,
        subscriptionId: subscription.id,
        amount: price,
        currency: 'USD',
        paymentMethod: paymentData.paymentMethod,
        paymentId: paymentData.paymentId,
        status: 'completed',
        transactionData: paymentData.transactionData
    });

    // Update user's subscription level
    await userRepository.update(userId, { subscription: plan });

    return {
        subscription,
        payment
    };
};

const getUserSubscription = async (userId) => {
    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription) {
        return {
            plan: 'basic',
            status: 'active',
            isSubscribed: false
        };
    }

    return {
        ...subscription.toJSON(),
        isSubscribed: subscription.status === 'active' && subscription.plan !== 'basic'
    };
};

const getUserSubscriptionHistory = async (userId, options = {}) => {
    return subscriptionRepository.findUserSubscriptionHistory(userId, options);
};

const getUserPaymentHistory = async (userId, options = {}) => {
    return paymentRepository.findByUserId(userId, options);
};

const cancelSubscription = async (userId, subscriptionId, reason = null) => {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    if (subscription.userId !== userId) {
        throw new ForbiddenError('User does not have permission to cancel this subscription');
    }

    if (subscription.status !== 'active') {
        throw new BadRequestError('Subscription is not active');
    }

    const cancelledSubscription = await subscriptionRepository.cancelSubscription(subscriptionId, reason);

    // When a user cancels, they keep their benefits until the end date
    // So we don't change the user's subscription level yet

    return cancelledSubscription;
};

const updateAutoRenew = async (userId, subscriptionId, autoRenew) => {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    if (subscription.userId !== userId) {
        throw new ForbiddenError('User does not have permission to update this subscription');
    }

    if (subscription.status !== 'active') {
        throw new BadRequestError('Subscription is not active');
    }

    return subscriptionRepository.update(subscriptionId, { autoRenew });
};

const changePlan = async (userId, subscriptionId, newPlan, billingCycle = null) => {
    // Validate plan
    if (!['gold', 'platinum', 'diamond'].includes(newPlan)) {
        throw new BadRequestError('Invalid subscription plan');
    }

    const subscription = await subscriptionRepository.findById(subscriptionId);

    if (subscription.userId !== userId) {
        throw new ForbiddenError('User does not have permission to update this subscription');
    }

    if (subscription.status !== 'active') {
        throw new BadRequestError('Subscription is not active');
    }

    if (subscription.plan === newPlan && (!billingCycle || subscription.billingCycle === billingCycle)) {
        throw new BadRequestError('No changes to make - same plan and billing cycle');
    }

    // If only changing the plan level (not billing cycle)
    if (!billingCycle || subscription.billingCycle === billingCycle) {
        const updatedSubscription = await subscriptionRepository.update(subscriptionId, {
            plan: newPlan,
            price: PLAN_PRICES[newPlan][subscription.billingCycle]
        });

        // Update user's subscription level
        await userRepository.update(userId, { subscription: newPlan });

        return updatedSubscription;
    }

    // If changing both plan and billing cycle, create a new subscription
    // First cancel the current one
    await subscriptionRepository.cancelSubscription(subscriptionId, 'Upgraded to new plan');

    // Then create a new one (would typically also handle payment here)
    // For simplicity, we'll just simulate a successful payment
    const paymentData = {
        paymentMethod: subscription.paymentMethod,
        paymentId: `upgrade-${Date.now()}`,
        transactionData: { source: 'plan change' }
    };

    return createSubscription(userId, { plan: newPlan, billingCycle }, paymentData);
};

const processRenewal = async (subscriptionId) => {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    if (subscription.status !== 'active' || !subscription.autoRenew) {
        throw new BadRequestError('Subscription is not active or auto-renew is disabled');
    }

    // Check if subscription is due for renewal (within 1 day of end date)
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (endDate - now > oneDayMs) {
        throw new BadRequestError('Subscription is not due for renewal yet');
    }

    // In a real system, you would process payment here
    // For this example, we'll assume payment succeeds

    // Calculate new dates
    const startDate = new Date(subscription.endDate);
    const newEndDate = calculateEndDate(startDate, subscription.billingCycle);

    // Create payment record
    const payment = await paymentRepository.create({
        userId: subscription.userId,
        subscriptionId: subscription.id,
        amount: subscription.price,
        currency: 'USD',
        paymentMethod: subscription.paymentMethod,
        paymentId: `renewal-${Date.now()}`,
        status: 'completed',
        transactionData: { type: 'renewal' }
    });

    // Update subscription
    const updatedSubscription = await subscriptionRepository.update(subscriptionId, {
        startDate,
        endDate: newEndDate,
        lastBillingDate: new Date(),
        nextBillingDate: newEndDate
    });

    return {
        subscription: updatedSubscription,
        payment
    };
};

const getSubscriptionStats = async (userId) => {
    const subscription = await subscriptionRepository.findByUserId(userId);
    const isSubscribed = subscription && subscription.status === 'active' && subscription.plan !== 'basic';

    return {
        isSubscribed,
        currentPlan: subscription ? subscription.plan : 'basic',
        subscriptionStatus: subscription ? subscription.status : null,
        daysRemaining: subscription ? Math.max(0, Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : 0,
        autoRenew: subscription ? subscription.autoRenew : false,
        billingCycle: subscription ? subscription.billingCycle : null
    };
};

module.exports = {
    createSubscription,
    getUserSubscription,
    getUserSubscriptionHistory,
    getUserPaymentHistory,
    cancelSubscription,
    updateAutoRenew,
    changePlan,
    processRenewal,
    getSubscriptionStats
};