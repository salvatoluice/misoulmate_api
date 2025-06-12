const calculateEndDate = (startDate, billingCycle) => {
    const endDate = new Date(startDate);

    if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    return endDate;
};

const calculatePlanPrice = (plan, billingCycle) => {
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

    if (!PLAN_PRICES[plan] || !PLAN_PRICES[plan][billingCycle]) {
        throw new Error(`Invalid plan (${plan}) or billing cycle (${billingCycle})`);
    }

    return PLAN_PRICES[plan][billingCycle];
};

const calculateYearlySavings = (plan) => {
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

    if (!PLAN_PRICES[plan]) {
        throw new Error(`Invalid plan: ${plan}`);
    }

    const monthlyTotal = PLAN_PRICES[plan].monthly * 12;
    const yearlyTotal = PLAN_PRICES[plan].yearly;

    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
};

const getPlanFeatures = (plan) => {
    const allFeatures = {
        basic: [
            { text: 'Create your profile', included: true },
            { text: 'View & like up to 10 profiles daily', included: true },
            { text: 'Message your matches', included: true },
            { text: 'Basic filters', included: true },
            { text: 'See who likes you', included: false },
            { text: 'Advanced filters', included: false },
            { text: 'Priority in search results', included: false },
            { text: 'Rewind to profiles you passed', included: false },
            { text: 'Incognito mode', included: false }
        ],
        gold: [
            { text: 'Everything in Basic', included: true },
            { text: 'Unlimited likes', included: true },
            { text: 'See who likes you', included: true },
            { text: 'Advanced filters', included: true },
            { text: '5 Super Likes per week', included: true },
            { text: 'Rewind to profiles you passed', included: true },
            { text: 'Priority in search results', included: false },
            { text: 'Incognito mode', included: false },
            { text: 'Read receipts', included: false }
        ],
        platinum: [
            { text: 'Everything in Gold', included: true },
            { text: 'Priority in search results', included: true },
            { text: 'Incognito mode', included: true },
            { text: 'Read receipts', included: true },
            { text: 'Unlimited Super Likes', included: true },
            { text: 'Monthly profile boost', included: true },
            { text: 'Message before matching', included: true },
            { text: 'See who visited your profile', included: true },
            { text: 'Priority customer support', included: true }
        ],
        diamond: [
            { text: 'Everything in Platinum', included: true },
            { text: 'VIP profile badge', included: true },
            { text: 'Weekly profile boost', included: true },
            { text: 'See when messages are read', included: true },
            { text: 'Premium matching algorithm', included: true },
            { text: 'Advanced statistics and insights', included: true },
            { text: 'Exclusive virtual events', included: true },
            { text: 'Personalized matchmaking tips', included: true },
            { text: 'Dedicated relationship coach', included: true }
        ]
    };

    return allFeatures[plan] || allFeatures.basic;
};

module.exports = {
    calculateEndDate,
    calculatePlanPrice,
    calculateYearlySavings,
    getPlanFeatures
};