const subscriptionService = require('../../services/subscription.service');
const { calculateYearlySavings, getPlanFeatures } = require('../../utils/subscription-helpers');

const getSubscriptionPlans = async (req, res, next) => {
    try {
        const userSubscription = await subscriptionService.getUserSubscription(req.user.id);

        const plans = [
            {
                id: 'basic',
                name: 'Basic',
                price: 0,
                pricePeriod: 'Free',
                description: 'Essential features to get started on your dating journey',
                color: 'gray',
                features: getPlanFeatures('basic'),
                billingOptions: [
                    { months: 0, pricePerMonth: 0, totalPrice: 0 }
                ]
            },
            {
                id: 'gold',
                name: 'Gold',
                price: 25,
                pricePeriod: 'per month',
                savings: `Save ${calculateYearlySavings('gold')}%`,
                popular: true,
                description: 'Enhanced features to maximize your chances of finding love',
                color: 'gold',
                features: getPlanFeatures('gold'),
                billingOptions: [
                    { months: 1, pricePerMonth: 25, totalPrice: 25 },
                    { months: 12, pricePerMonth: 10, totalPrice: 120 }
                ]
            },
            {
                id: 'platinum',
                name: 'Platinum',
                price: 40,
                pricePeriod: 'per month',
                savings: `Save ${calculateYearlySavings('platinum')}%`,
                description: 'Premium experience with exclusive features for serious daters',
                color: 'primary',
                features: getPlanFeatures('platinum'),
                billingOptions: [
                    { months: 1, pricePerMonth: 40, totalPrice: 40 },
                    { months: 12, pricePerMonth: 13.33, totalPrice: 160 }
                ]
            },
            {
                id: 'diamond',
                name: 'Diamond',
                price: 60,
                pricePeriod: 'per month',
                savings: `Save ${calculateYearlySavings('diamond')}%`,
                description: 'Elite experience with all premium features and exclusive perks',
                color: 'blue',
                features: getPlanFeatures('diamond'),
                billingOptions: [
                    { months: 1, pricePerMonth: 60, totalPrice: 60 },
                    { months: 12, pricePerMonth: 18.33, totalPrice: 220 }
                ]
            }
        ];

        res.json({
            plans,
            currentSubscription: userSubscription
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionService.getUserSubscription(req.user.id);
        res.json(subscription);
    } catch (error) {
        next(error);
    }
};

const getSubscriptionHistory = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const offset = (page - 1) * limit;

        const history = await subscriptionService.getUserSubscriptionHistory(req.user.id, { limit, offset });

        res.json({
            subscriptions: history.rows,
            pagination: {
                total: history.count,
                page,
                limit,
                pages: Math.ceil(history.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getPaymentHistory = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const offset = (page - 1) * limit;

        const history = await subscriptionService.getUserPaymentHistory(req.user.id, { limit, offset });

        res.json({
            payments: history.rows,
            pagination: {
                total: history.count,
                page,
                limit,
                pages: Math.ceil(history.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const createSubscription = async (req, res, next) => {
    try {
        const { plan, billingCycle, paymentMethod, paymentToken } = req.body;

        // In a real application, you would process the payment here
        // using a payment processor like Stripe
        const paymentData = {
            paymentMethod,
            paymentId: `payment-${Date.now()}`, // This would come from payment processor
            transactionData: { token: paymentToken }
        };

        const result = await subscriptionService.createSubscription(
            req.user.id,
            { plan, billingCycle },
            paymentData
        );

        res.status(201).json({
            subscription: result.subscription,
            payment: result.payment
        });
    } catch (error) {
        next(error);
    }
};

const cancelSubscription = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const { id } = req.params;

        const subscription = await subscriptionService.cancelSubscription(req.user.id, id, reason);

        res.json({
            subscription,
            message: 'Subscription cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

const updateAutoRenew = async (req, res, next) => {
    try {
        const { autoRenew } = req.body;
        const { id } = req.params;

        const subscription = await subscriptionService.updateAutoRenew(req.user.id, id, autoRenew);

        res.json({
            subscription,
            message: `Auto-renew ${autoRenew ? 'enabled' : 'disabled'} successfully`
        });
    } catch (error) {
        next(error);
    }
};

const changePlan = async (req, res, next) => {
    try {
        const { plan, billingCycle } = req.body;
        const { id } = req.params;

        const result = await subscriptionService.changePlan(req.user.id, id, plan, billingCycle);

        res.json({
            subscription: result.subscription || result,
            payment: result.payment,
            message: 'Subscription plan updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

const getSubscriptionStats = async (req, res, next) => {
    try {
        const stats = await subscriptionService.getSubscriptionStats(req.user.id);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSubscriptionPlans,
    getCurrentSubscription,
    getSubscriptionHistory,
    getPaymentHistory,
    createSubscription,
    cancelSubscription,
    updateAutoRenew,
    changePlan,
    getSubscriptionStats
};