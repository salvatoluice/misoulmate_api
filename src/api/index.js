const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const profileRoutes = require('./profiles');
const matchRoutes = require('./matches');
const messageRoutes = require('./messages');
const recommendationRoutes = require('./recommendation');
const { error } = require('./middlewares');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/matches', matchRoutes);
router.use('/messages', messageRoutes);
router.use('/recommendations', recommendationRoutes);

router.use(error.errorHandler);

module.exports = router;