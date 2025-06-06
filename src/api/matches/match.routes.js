const express = require('express');
const matchController = require('./match.controller');
const matchValidator = require('./match.validator');
const { auth, validation } = require('../middlewares');

const router = express.Router();

router.post(
    '/likes',
    auth.authenticate,
    validation.validate(matchValidator.createLikeSchema),
    matchController.createLike
);

router.get(
    '/likes/given',
    auth.authenticate,
    validation.validate(matchValidator.getQuerySchema, 'query'),
    matchController.getLikesGiven
);

router.get(
    '/likes/received',
    auth.authenticate,
    validation.validate(matchValidator.getQuerySchema, 'query'),
    matchController.getLikesReceived
);

router.get(
    '/',
    auth.authenticate,
    validation.validate(matchValidator.getQuerySchema, 'query'),
    matchController.getMatches
);

router.get(
    '/stats',
    auth.authenticate,
    matchController.getMatchStats
);

router.get(
    '/:id',
    auth.authenticate,
    validation.validate(matchValidator.matchIdParamSchema, 'params'),
    matchController.getMatchById
);

router.post(
    '/:id/unmatch',
    auth.authenticate,
    validation.validate(matchValidator.matchIdParamSchema, 'params'),
    validation.validate(matchValidator.unmatchSchema),
    matchController.unmatch
);

module.exports = router;