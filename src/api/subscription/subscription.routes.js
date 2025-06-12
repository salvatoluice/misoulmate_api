const express = require('express');
const subscriptionController = require('./subscription.controller');
const subscriptionValidator = require('./subscription.validator');
const { auth, validation } = require('../middlewares');

const router = express.Router();

router.get(
    '/plans',
    auth.authenticate,
    subscriptionController.getSubscriptionPlans
);

router.get(
    '/current',
    auth.authenticate,
    subscriptionController.getCurrentSubscription
);

router.get(
    '/history',
    auth.authenticate,
    validation.validate(subscriptionValidator.getQuerySchema, 'query'),
    subscriptionController.getSubscriptionHistory
);

router.get(
    '/payments',
    auth.authenticate,
    validation.validate(subscriptionValidator.getQuerySchema, 'query'),
    subscriptionController.getPaymentHistory
);

router.get(
    '/stats',
    auth.authenticate,
    subscriptionController.getSubscriptionStats
);

router.post(
    '/',
    auth.authenticate,
    validation.validate(subscriptionValidator.createSubscriptionSchema),
    subscriptionController.createSubscription
);

router.post(
    '/:id/cancel',
    auth.authenticate,
    validation.validate(subscriptionValidator.subscriptionIdParamSchema, 'params'),
    validation.validate(subscriptionValidator.cancelSubscriptionSchema),
    subscriptionController.cancelSubscription
);

router.patch(
    '/:id/auto-renew',
    auth.authenticate,
    validation.validate(subscriptionValidator.subscriptionIdParamSchema, 'params'),
    validation.validate(subscriptionValidator.updateAutoRenewSchema),
    subscriptionController.updateAutoRenew
);

router.patch(
    '/:id/change-plan',
    auth.authenticate,
    validation.validate(subscriptionValidator.subscriptionIdParamSchema, 'params'),
    validation.validate(subscriptionValidator.changePlanSchema),
    subscriptionController.changePlan
);

module.exports = router;