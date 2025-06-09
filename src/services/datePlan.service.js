// services/datePlan.service.js
const datePlanRepository = require('../repositories/datePlan.repository');
const matchRepository = require('../repositories/match.repository');
const { BadRequestError, ForbiddenError } = require('../utils/errors');

/**
 * Create a new date plan
 */
const createDatePlan = async (matchId, userId, datePlanData) => {
    // Verify match exists and user is a participant
    const match = await matchRepository.findById(matchId);

    if (match.status !== 'active') {
        throw new BadRequestError('Cannot create a date plan for an inactive match');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You can only create date plans for your matches');
    }

    // Create date plan
    const datePlan = await datePlanRepository.create({
        matchId,
        creatorId: userId,
        ...datePlanData
    });

    return datePlan;
};

/**
 * Get a date plan by ID
 */
const getDatePlanById = async (id, userId) => {
    const datePlan = await datePlanRepository.findById(id);

    // Check if user is a participant in the match
    const match = datePlan.match;
    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this date plan');
    }

    return datePlan;
};

/**
 * Get all date plans for a match
 */
const getDatePlansByMatchId = async (matchId, userId) => {
    // Verify match exists and user is a participant
    const match = await matchRepository.findById(matchId);

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You can only view date plans for your matches');
    }

    return datePlanRepository.findByMatchId(matchId);
};

/**
 * Get upcoming date plans for a user
 */
const getUpcomingDatePlans = async (userId, options = {}) => {
    return datePlanRepository.findUpcomingByUserId(userId, options);
};

/**
 * Update a date plan
 */
const updateDatePlan = async (id, userId, datePlanData) => {
    const datePlan = await datePlanRepository.findById(id);

    // Verify user is the creator
    if (datePlan.creatorId !== userId) {
        throw new ForbiddenError('Only the creator can update this date plan');
    }

    // Cannot update a date plan that has already been responded to
    if (datePlan.status !== 'proposed') {
        throw new BadRequestError(`Cannot update a date plan with status: ${datePlan.status}`);
    }

    return datePlanRepository.update(id, datePlanData);
};

/**
 * Delete a date plan
 */
const deleteDatePlan = async (id, userId) => {
    const datePlan = await datePlanRepository.findById(id);

    // Verify user is the creator
    if (datePlan.creatorId !== userId) {
        throw new ForbiddenError('Only the creator can delete this date plan');
    }

    // Cannot delete a date plan that is confirmed or completed
    if (['confirmed', 'completed'].includes(datePlan.status)) {
        throw new BadRequestError(`Cannot delete a date plan with status: ${datePlan.status}`);
    }

    return datePlanRepository.remove(id);
};

/**
 * Respond to a date plan
 */
const respondToDatePlan = async (id, userId, status) => {
    const datePlan = await datePlanRepository.findById(id);
    const match = datePlan.match;

    // Verify user is a participant but not the creator
    if (datePlan.creatorId === userId) {
        throw new BadRequestError('You cannot respond to your own date plan');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this date plan');
    }

    // Cannot respond to a date plan that is not proposed
    if (datePlan.status !== 'proposed') {
        throw new BadRequestError(`Cannot respond to a date plan with status: ${datePlan.status}`);
    }

    return datePlanRepository.respond(id, userId, status);
};

/**
 * Cancel a date plan
 */
const cancelDatePlan = async (id, userId) => {
    const datePlan = await datePlanRepository.findById(id);
    const match = datePlan.match;

    // Verify user is a participant
    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this date plan');
    }

    // Cannot cancel a completed date plan
    if (datePlan.status === 'completed') {
        throw new BadRequestError('Cannot cancel a completed date plan');
    }

    return datePlanRepository.respond(id, userId, 'canceled');
};

/**
 * Mark a date plan as completed
 */
const completeDatePlan = async (id, userId) => {
    const datePlan = await datePlanRepository.findById(id);
    const match = datePlan.match;

    // Verify user is a participant
    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this date plan');
    }

    // Can only complete a confirmed date plan
    if (datePlan.status !== 'confirmed') {
        throw new BadRequestError('Only confirmed date plans can be marked as completed');
    }

    // Can only complete a date plan after its scheduled time
    const now = new Date();
    if (datePlan.dateTime > now) {
        throw new BadRequestError('Cannot mark a future date plan as completed');
    }

    return datePlanRepository.complete(id);
};

module.exports = {
    createDatePlan,
    getDatePlanById,
    getDatePlansByMatchId,
    getUpcomingDatePlans,
    updateDatePlan,
    deleteDatePlan,
    respondToDatePlan,
    cancelDatePlan,
    completeDatePlan
};