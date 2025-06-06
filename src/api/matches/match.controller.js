const matchService = require('../../services/match.service');

const createLike = async (req, res, next) => {
    try {
        const { likedId, status } = req.body;
        const result = await matchService.createLike(req.user.id, likedId, status);

        res.status(201).json({
            like: result.like,
            isMatch: result.isMatch,
            match: result.match
        });
    } catch (error) {
        next(error);
    }
};

const getLikesGiven = async (req, res, next) => {
    try {
        const { limit = 20, page = 1, status = 'like' } = req.query;
        const offset = (page - 1) * limit;

        const likes = await matchService.getUserLikes(req.user.id, { limit, offset, status });

        res.json({
            likes: likes.rows,
            pagination: {
                total: likes.count,
                page,
                limit,
                pages: Math.ceil(likes.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getLikesReceived = async (req, res, next) => {
    try {
        const { limit = 20, page = 1, status = 'like' } = req.query;
        const offset = (page - 1) * limit;

        const likes = await matchService.getUserLikedBy(req.user.id, { limit, offset, status });

        res.json({
            likes: likes.rows,
            pagination: {
                total: likes.count,
                page,
                limit,
                pages: Math.ceil(likes.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMatches = async (req, res, next) => {
    try {
        const { limit = 20, page = 1, status = 'active' } = req.query;
        const offset = (page - 1) * limit;

        const matches = await matchService.getUserMatches(req.user.id, { limit, offset, status });

        res.json({
            matches: matches.rows,
            pagination: {
                total: matches.count,
                page,
                limit,
                pages: Math.ceil(matches.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMatchById = async (req, res, next) => {
    try {
        const match = await matchService.getMatchById(req.params.id, req.user.id);
        res.json(match);
    } catch (error) {
        next(error);
    }
};

const unmatch = async (req, res, next) => {
    try {
        const { reason } = req.body;
        await matchService.unmatchUsers(req.params.id, req.user.id, reason);
        res.status(200).json({ message: 'Successfully unmatched' });
    } catch (error) {
        next(error);
    }
};

const getMatchStats = async (req, res, next) => {
    try {
        const stats = await matchService.getMatchStats(req.user.id);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLike,
    getLikesGiven,
    getLikesReceived,
    getMatches,
    getMatchById,
    unmatch,
    getMatchStats
};