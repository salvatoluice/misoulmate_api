/**
 * Combine all API routes
 */
const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const profileRoutes = require('./profiles');
const { error } = require('./middlewares');

const router = express.Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);

// Error handler
router.use(error.errorHandler);

module.exports = router;