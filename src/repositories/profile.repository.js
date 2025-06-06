/**
 * Profile repository - Database operations for profiles
 */
const { Profile, ProfileQuestion, User } = require('../models');
const { NotFoundError } = require('../utils/errors');

/**
 * Create a new profile
 * @param {Object} profileData - Profile data
 * @returns {Promise<Object>} Created profile
 */
const create = async (profileData) => {
    const profile = await Profile.create(profileData);

    // Create profile questions if provided
    if (profileData.questions && profileData.questions.length > 0) {
        const questions = profileData.questions.map(q => ({
            ...q,
            profileId: profile.id
        }));

        await ProfileQuestion.bulkCreate(questions);
    }

    return findById(profile.id);
};

/**
 * Find profile by ID with questions
 * @param {string} id - Profile ID
 * @returns {Promise<Object>} Profile with questions
 */
const findById = async (id) => {
    const profile = await Profile.findByPk(id, {
        include: [
            {
                model: ProfileQuestion,
                as: 'questions'
            }
        ]
    });

    if (!profile) {
        throw new NotFoundError(`Profile with ID ${id} not found`);
    }

    return profile;
};

/**
 * Find profile by user ID with questions
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Profile with questions
 */
const findByUserId = async (userId) => {
    const profile = await Profile.findOne({
        where: { userId },
        include: [
            {
                model: ProfileQuestion,
                as: 'questions'
            }
        ]
    });

    if (!profile) {
        throw new NotFoundError(`Profile for user ID ${userId} not found`);
    }

    return profile;
};

/**
 * Update profile
 * @param {string} id - Profile ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated profile
 */
const update = async (id, updateData) => {
    const profile = await findById(id);

    // Handle questions separately
    const { questions, ...profileData } = updateData;

    await profile.update(profileData);

    // Update questions if provided
    if (questions && questions.length > 0) {
        // Delete existing questions
        await ProfileQuestion.destroy({
            where: { profileId: id }
        });

        // Create new questions
        const questionsData = questions.map(q => ({
            ...q,
            profileId: id
        }));

        await ProfileQuestion.bulkCreate(questionsData);
    }

    return findById(id);
};

/**
 * Delete profile
 * @param {string} id - Profile ID
 * @returns {Promise<boolean>} Success
 */
const remove = async (id) => {
    const profile = await findById(id);
    await profile.destroy();
    return true;
};

/**
 * Update last active timestamp
 * @param {string} id - Profile ID
 * @returns {Promise<Object>} Updated profile
 */
const updateLastActive = async (id) => {
    const profile = await findById(id);
    return profile.update({ lastActive: new Date() });
};

module.exports = {
    create,
    findById,
    findByUserId,
    update,
    remove,
    updateLastActive
};