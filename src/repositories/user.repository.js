/**
 * User repository - Database operations for users
 */
const { User } = require('../models');
const { NotFoundError } = require('../utils/errors');

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const create = async (userData) => {
    return User.create(userData);
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User
 */
const findById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User or null
 */
const findByEmail = async (email) => {
    return User.findOne({ where: { email } });
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
const update = async (id, updateData) => {
    const user = await findById(id);
    return user.update(updateData);
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<boolean>} Success
 */
const remove = async (id) => {
    const user = await findById(id);
    await user.destroy();
    return true;
};

/**
 * Update last login timestamp
 * @param {string} id - User ID
 * @returns {Promise<Object>} Updated user
 */
const updateLastLogin = async (id) => {
    const user = await findById(id);
    return user.update({ lastLogin: new Date() });
};

module.exports = {
    create,
    findById,
    findByEmail,
    update,
    remove,
    updateLastLogin
};